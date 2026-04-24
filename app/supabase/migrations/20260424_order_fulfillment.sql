-- =============================================================================
-- Order fulfillment engine — auto-fulfill on Stripe payment
-- Depends on: 20260423_gtin_engine.sql (tables, enums, is_admin helper)
-- =============================================================================

-- ---------- Schema additions ------------------------------------------------

ALTER TABLE public.gtin_pool
  ADD COLUMN IF NOT EXISTS item_ref text;

ALTER TABLE public.gtin_product_records
  ADD COLUMN IF NOT EXISTS item_ref text;

CREATE INDEX IF NOT EXISTS idx_gtin_pool_order_item
  ON public.gtin_pool (order_id, item_ref)
  WHERE order_id IS NOT NULL;

ALTER TABLE public.customer_orders
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_orders_stripe_session
  ON public.customer_orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- ---------- Helpers ---------------------------------------------------------

-- compose_inci_for_product: concatenates ingredient names for a product's
-- formulation, ordered by phase.
CREATE OR REPLACE FUNCTION public.compose_inci_for_product(p_product_id uuid)
RETURNS text LANGUAGE sql STABLE AS $func$
  SELECT string_agg(i.name, ', ' ORDER BY pi.phase NULLS LAST, i.name)
  FROM public.product_ingredients pi
  JOIN public.ingredients i ON i.id = pi.ingredient_id
  WHERE pi.product_id = p_product_id;
$func$;

-- default_net_content: maps product category to physical net content string.
CREATE OR REPLACE FUNCTION public.default_net_content(p_category text)
RETURNS text LANGUAGE sql IMMUTABLE AS $func$
  SELECT CASE lower(p_category)
    WHEN 'cleanser' THEN '150 ml'
    WHEN 'serum' THEN '30 ml'
    WHEN 'moisturizer' THEN '50 ml'
    ELSE NULL
  END;
$func$;

-- ---------- Core RPC --------------------------------------------------------

-- fulfill_order_with_barcodes: atomic + idempotent. For every item in an
-- order, reserves the next pool GTIN, composes a full product record with
-- INCI pulled from the quiz → product → ingredients chain, then marks the
-- order fulfilled. Called by the Stripe webhook on checkout.session.completed.
CREATE OR REPLACE FUNCTION public.fulfill_order_with_barcodes(
  p_order_id  uuid,
  p_issuer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $func$
DECLARE
  v_order         RECORD;
  v_item          jsonb;
  v_idx           int := 0;
  v_item_ref      text;
  v_existing_gtin text;
  v_gtin          text;
  v_product_id    uuid;
  v_product_name  text;
  v_category      text;
  v_inci          text;
  v_net_content   text;
  v_result        jsonb := '[]'::jsonb;
  v_record        jsonb;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'fulfill_order_with_barcodes: admin required';
  END IF;

  SELECT * INTO v_order
  FROM public.customer_orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order % not found', p_order_id;
  END IF;

  IF v_order.items IS NULL OR jsonb_array_length(v_order.items) = 0 THEN
    RAISE EXCEPTION 'order has no items';
  END IF;

  FOR v_item IN SELECT jsonb_array_elements(v_order.items) LOOP
    v_item_ref     := 'item_' || v_idx;
    v_product_id   := NULLIF(v_item->>'productId', '')::uuid;
    v_product_name := v_item->>'productName';
    v_category     := v_item->>'category';

    -- Idempotency: reuse existing GTIN for this order+item_ref if present
    SELECT gtin INTO v_existing_gtin
    FROM public.gtin_pool
    WHERE order_id = p_order_id
      AND item_ref = v_item_ref
      AND status <> 'voided'
    LIMIT 1;

    IF v_existing_gtin IS NOT NULL THEN
      v_gtin := v_existing_gtin;
    ELSE
      -- Reserve next available GTIN (lock + skip locked so concurrent
      -- fulfillments can proceed independently)
      SELECT gtin INTO v_gtin
      FROM public.gtin_pool
      WHERE issuer_id = p_issuer_id
        AND status = 'available'
      ORDER BY gtin
      LIMIT 1
      FOR UPDATE SKIP LOCKED;

      IF v_gtin IS NULL THEN
        PERFORM public.replenish_pool(p_issuer_id, NULL);

        SELECT gtin INTO v_gtin
        FROM public.gtin_pool
        WHERE issuer_id = p_issuer_id
          AND status = 'available'
        ORDER BY gtin
        LIMIT 1
        FOR UPDATE SKIP LOCKED;

        IF v_gtin IS NULL THEN
          RAISE EXCEPTION 'pool exhausted';
        END IF;
      END IF;

      UPDATE public.gtin_pool
      SET status = 'reserved',
          order_id = p_order_id,
          item_ref = v_item_ref,
          reserved_at = now()
      WHERE gtin = v_gtin;

      INSERT INTO public.gtin_audit_log
        (gtin, event, order_id, actor, metadata)
      VALUES (v_gtin, 'reserved', p_order_id, auth.uid(),
              jsonb_build_object('item_ref', v_item_ref, 'product_id', v_product_id));

      v_inci := public.compose_inci_for_product(v_product_id);
      v_net_content := public.default_net_content(v_category);

      INSERT INTO public.gtin_product_records
        (gtin, order_id, item_ref, name, net_content, variant, inci, eu_fields, composed_by)
      VALUES (
        v_gtin, p_order_id, v_item_ref,
        COALESCE(v_product_name, v_category),
        v_net_content,
        v_category,
        v_inci,
        jsonb_build_object(
          'category', v_category,
          'skin_type', v_item->>'skinType',
          'fragrance', v_item->>'fragranceOption'
        ),
        auth.uid()
      );

      INSERT INTO public.gtin_audit_log
        (gtin, event, order_id, actor, metadata)
      VALUES (v_gtin, 'composed', p_order_id, auth.uid(),
              jsonb_build_object('item_ref', v_item_ref));
    END IF;

    -- Assemble return record from the composed product record
    SELECT jsonb_build_object(
      'item_ref',    v_item_ref,
      'gtin',        v_gtin,
      'category',    v_category,
      'name',        r.name,
      'net_content', r.net_content,
      'variant',     r.variant,
      'inci',        r.inci,
      'eu_fields',   r.eu_fields
    ) INTO v_record
    FROM public.gtin_product_records r
    WHERE r.gtin = v_gtin
    LIMIT 1;

    v_result := v_result || v_record;
    v_idx := v_idx + 1;
  END LOOP;

  UPDATE public.customer_orders
  SET fulfilled_at = COALESCE(fulfilled_at, now()),
      status = CASE WHEN status = 'pending' THEN 'fulfilled' ELSE status END
  WHERE id = p_order_id;

  RETURN v_result;
END;
$func$;

-- reset_issuer: destructive admin-only helper for pre-launch testing.
-- Wipes every GTIN + product record + audit entry + sync log tied to an
-- issuer, then deletes the issuer itself. NEVER call in production.
CREATE OR REPLACE FUNCTION public.reset_issuer(p_issuer_id uuid)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $func$
DECLARE
  v_gtins text[];
  v_count int;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'reset_issuer: admin required';
  END IF;

  SELECT array_agg(gtin) INTO v_gtins
  FROM public.gtin_pool
  WHERE issuer_id = p_issuer_id;

  v_count := COALESCE(array_length(v_gtins, 1), 0);

  IF v_gtins IS NOT NULL THEN
    DELETE FROM public.gtin_product_records WHERE gtin = ANY(v_gtins);
    DELETE FROM public.gtin_audit_log       WHERE gtin = ANY(v_gtins);
  END IF;

  DELETE FROM public.gtin_sync_log WHERE issuer_id = p_issuer_id;
  DELETE FROM public.gtin_pool     WHERE issuer_id = p_issuer_id;
  DELETE FROM public.gtin_issuers  WHERE id = p_issuer_id;

  RETURN v_count;
END;
$func$;

-- ---------- Grants ----------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.compose_inci_for_product(uuid)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.default_net_content(text)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.fulfill_order_with_barcodes(uuid, uuid)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_issuer(uuid)
  TO authenticated;
