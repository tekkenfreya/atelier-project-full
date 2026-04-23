-- =============================================================================
-- GTIN Engine — pool-based, atomic allocation, full audit trail
-- =============================================================================

-- ---------- Enums ------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.gtin_symbology AS ENUM ('ean13', 'upca', 'itf14');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.gtin_status AS ENUM (
    'available',
    'reserved',
    'used',
    'activated',
    'voided'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- Tables -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gtin_issuers (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_prefix       text NOT NULL,
  brand                text NOT NULL,
  symbology            public.gtin_symbology NOT NULL DEFAULT 'ean13',
  next_ref             bigint NOT NULL DEFAULT 0,
  pool_batch_size      int NOT NULL DEFAULT 100,
  pool_low_threshold   int NOT NULL DEFAULT 20,
  gs1_verified         boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now(),
  created_by           uuid REFERENCES auth.users(id),
  UNIQUE (company_prefix, symbology)
);

CREATE TABLE IF NOT EXISTS public.gtin_pool (
  gtin                 text PRIMARY KEY,
  issuer_id            uuid NOT NULL REFERENCES public.gtin_issuers(id) ON DELETE RESTRICT,
  symbology            public.gtin_symbology NOT NULL,
  status               public.gtin_status NOT NULL DEFAULT 'available',
  order_id             uuid REFERENCES public.customer_orders(id) ON DELETE SET NULL,
  reserved_at          timestamptz,
  used_at              timestamptz,
  activated_at         timestamptz,
  voided_at            timestamptz,
  voided_reason        text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gtin_pool_issuer_status
  ON public.gtin_pool (issuer_id, status);

CREATE INDEX IF NOT EXISTS idx_gtin_pool_order
  ON public.gtin_pool (order_id) WHERE order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.gtin_product_records (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gtin         text NOT NULL REFERENCES public.gtin_pool(gtin) ON DELETE RESTRICT,
  order_id     uuid REFERENCES public.customer_orders(id) ON DELETE SET NULL,
  name         text NOT NULL,
  net_content  text,
  variant      text,
  inci         text,
  eu_fields    jsonb NOT NULL DEFAULT '{}'::jsonb,
  composed_at  timestamptz NOT NULL DEFAULT now(),
  composed_by  uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_gtin_product_records_gtin
  ON public.gtin_product_records (gtin);

CREATE TABLE IF NOT EXISTS public.gtin_audit_log (
  id           bigserial PRIMARY KEY,
  gtin         text NOT NULL,
  event        text NOT NULL,
  order_id     uuid,
  actor        uuid REFERENCES auth.users(id),
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gtin_audit_gtin
  ON public.gtin_audit_log (gtin);

CREATE INDEX IF NOT EXISTS idx_gtin_audit_occurred
  ON public.gtin_audit_log (occurred_at DESC);

CREATE TABLE IF NOT EXISTS public.gtin_sync_log (
  id             bigserial PRIMARY KEY,
  issuer_id      uuid NOT NULL REFERENCES public.gtin_issuers(id),
  sync_date      date NOT NULL,
  method         text NOT NULL CHECK (method IN ('csv', 'api', 'manual')),
  status         text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'success', 'failed')),
  gtin_count     int NOT NULL,
  gtins          text[] NOT NULL,
  submitted_at   timestamptz,
  file_name      text,
  error_message  text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     uuid REFERENCES auth.users(id)
);

-- ---------- Helpers ----------------------------------------------------------

-- GS1 mod-10 check digit (rightmost digit gets weight 3, alternating)
CREATE OR REPLACE FUNCTION public.gs1_check_digit(body text)
RETURNS int
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  i int;
  d int;
  w int;
  s int := 0;
  n int;
BEGIN
  IF body IS NULL OR body !~ '^\d+$' THEN
    RAISE EXCEPTION 'gs1_check_digit: body must be digits only, got %', body;
  END IF;
  n := length(body);
  FOR i IN 1..n LOOP
    d := substring(body FROM i FOR 1)::int;
    -- Rightmost position (i = n) weight 3, then alternating
    w := CASE WHEN (n - i) % 2 = 0 THEN 3 ELSE 1 END;
    s := s + d * w;
  END LOOP;
  RETURN CASE WHEN s % 10 = 0 THEN 0 ELSE 10 - (s % 10) END;
END;
$$;

-- Admin guard — shared with other RPCs
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Symbology → total length
CREATE OR REPLACE FUNCTION public.gtin_length(sym public.gtin_symbology)
RETURNS int
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE sym
    WHEN 'ean13' THEN 13
    WHEN 'upca'  THEN 12
    WHEN 'itf14' THEN 14
  END;
$$;

-- ---------- RPCs -------------------------------------------------------------

-- configure_issuer: one-time setup. Creates issuer + initial pool batch.
CREATE OR REPLACE FUNCTION public.configure_issuer(
  p_company_prefix     text,
  p_brand              text,
  p_symbology          public.gtin_symbology DEFAULT 'ean13',
  p_initial_batch_size int DEFAULT 100
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_issuer_id uuid;
  v_total_len int;
  v_ref_len   int;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'configure_issuer: admin required';
  END IF;

  IF p_company_prefix !~ '^\d+$' THEN
    RAISE EXCEPTION 'configure_issuer: prefix must be digits only';
  END IF;

  v_total_len := public.gtin_length(p_symbology);
  v_ref_len   := v_total_len - 1 - length(p_company_prefix);

  IF v_ref_len < 1 THEN
    RAISE EXCEPTION 'configure_issuer: prefix too long for %', p_symbology;
  END IF;

  IF length(p_company_prefix) < 6 THEN
    RAISE EXCEPTION 'configure_issuer: prefix must be at least 6 digits';
  END IF;

  INSERT INTO public.gtin_issuers (company_prefix, brand, symbology, created_by)
  VALUES (p_company_prefix, p_brand, p_symbology, auth.uid())
  RETURNING id INTO v_issuer_id;

  PERFORM public.replenish_pool(v_issuer_id, p_initial_batch_size);

  RETURN v_issuer_id;
END;
$$;

-- replenish_pool: generate next N GTINs into pool (idempotent within tx).
CREATE OR REPLACE FUNCTION public.replenish_pool(
  p_issuer_id uuid,
  p_count     int DEFAULT NULL
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_issuer    public.gtin_issuers%ROWTYPE;
  v_count     int;
  v_ref_len   int;
  v_total_len int;
  v_start     bigint;
  v_end       bigint;
  v_i         bigint;
  v_body      text;
  v_gtin      text;
  v_inserted  int := 0;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'replenish_pool: admin required';
  END IF;

  SELECT * INTO v_issuer
  FROM public.gtin_issuers
  WHERE id = p_issuer_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'replenish_pool: issuer % not found', p_issuer_id;
  END IF;

  v_count := COALESCE(p_count, v_issuer.pool_batch_size);
  IF v_count <= 0 THEN
    RETURN 0;
  END IF;

  v_total_len := public.gtin_length(v_issuer.symbology);
  v_ref_len   := v_total_len - 1 - length(v_issuer.company_prefix);
  v_start     := v_issuer.next_ref;
  v_end       := v_start + v_count - 1;

  FOR v_i IN v_start..v_end LOOP
    v_body := v_issuer.company_prefix || lpad(v_i::text, v_ref_len, '0');
    v_gtin := v_body || public.gs1_check_digit(v_body)::text;

    INSERT INTO public.gtin_pool (gtin, issuer_id, symbology, status)
    VALUES (v_gtin, p_issuer_id, v_issuer.symbology, 'available')
    ON CONFLICT (gtin) DO NOTHING;

    IF FOUND THEN
      v_inserted := v_inserted + 1;
      INSERT INTO public.gtin_audit_log (gtin, event, actor, metadata)
      VALUES (v_gtin, 'generated', auth.uid(),
              jsonb_build_object('issuer_id', p_issuer_id));
    END IF;
  END LOOP;

  UPDATE public.gtin_issuers
  SET next_ref = v_end + 1
  WHERE id = p_issuer_id;

  RETURN v_inserted;
END;
$$;

-- reserve_gtin_for_order: atomic allocation. Auto-replenishes if pool runs low.
CREATE OR REPLACE FUNCTION public.reserve_gtin_for_order(
  p_issuer_id uuid,
  p_order_id  uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_gtin      text;
  v_available int;
  v_threshold int;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'reserve_gtin_for_order: admin required';
  END IF;

  -- Lock + pull next available
  SELECT gtin INTO v_gtin
  FROM public.gtin_pool
  WHERE issuer_id = p_issuer_id
    AND status = 'available'
  ORDER BY gtin
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- Pool empty → replenish then retry
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
      RAISE EXCEPTION 'reserve_gtin_for_order: pool exhausted';
    END IF;
  END IF;

  UPDATE public.gtin_pool
  SET status = 'reserved',
      order_id = p_order_id,
      reserved_at = now()
  WHERE gtin = v_gtin;

  INSERT INTO public.gtin_audit_log (gtin, event, order_id, actor)
  VALUES (v_gtin, 'reserved', p_order_id, auth.uid());

  -- Fire-and-forget low-pool check (does NOT block return)
  SELECT COUNT(*), i.pool_low_threshold
  INTO v_available, v_threshold
  FROM public.gtin_pool p
  JOIN public.gtin_issuers i ON i.id = p.issuer_id
  WHERE p.issuer_id = p_issuer_id
    AND p.status = 'available'
  GROUP BY i.pool_low_threshold;

  IF v_available IS NOT NULL AND v_available < v_threshold THEN
    PERFORM public.replenish_pool(p_issuer_id, NULL);
  END IF;

  RETURN v_gtin;
END;
$$;

-- compose_product_record: save the product data tied to a reserved GTIN
CREATE OR REPLACE FUNCTION public.compose_product_record(
  p_gtin        text,
  p_name        text,
  p_net_content text DEFAULT NULL,
  p_variant     text DEFAULT NULL,
  p_inci        text DEFAULT NULL,
  p_eu_fields   jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record_id uuid;
  v_order_id  uuid;
  v_status    public.gtin_status;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'compose_product_record: admin required';
  END IF;

  SELECT order_id, status INTO v_order_id, v_status
  FROM public.gtin_pool WHERE gtin = p_gtin FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'compose_product_record: gtin % not in pool', p_gtin;
  END IF;

  IF v_status NOT IN ('reserved', 'used') THEN
    RAISE EXCEPTION 'compose_product_record: gtin % is %, expected reserved/used',
                    p_gtin, v_status;
  END IF;

  INSERT INTO public.gtin_product_records
    (gtin, order_id, name, net_content, variant, inci, eu_fields, composed_by)
  VALUES
    (p_gtin, v_order_id, p_name, p_net_content, p_variant, p_inci, p_eu_fields, auth.uid())
  RETURNING id INTO v_record_id;

  INSERT INTO public.gtin_audit_log (gtin, event, order_id, actor, metadata)
  VALUES (p_gtin, 'composed', v_order_id, auth.uid(),
          jsonb_build_object('record_id', v_record_id));

  RETURN v_record_id;
END;
$$;

-- mark_gtin_used: called after label applied + scan-verified
CREATE OR REPLACE FUNCTION public.mark_gtin_used(p_gtin text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status   public.gtin_status;
  v_order_id uuid;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'mark_gtin_used: admin required';
  END IF;

  SELECT status, order_id INTO v_status, v_order_id
  FROM public.gtin_pool WHERE gtin = p_gtin FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'mark_gtin_used: gtin % not in pool', p_gtin;
  END IF;

  IF v_status <> 'reserved' THEN
    RAISE EXCEPTION 'mark_gtin_used: gtin % is %, expected reserved',
                    p_gtin, v_status;
  END IF;

  UPDATE public.gtin_pool
  SET status = 'used', used_at = now()
  WHERE gtin = p_gtin;

  INSERT INTO public.gtin_audit_log (gtin, event, order_id, actor)
  VALUES (p_gtin, 'used', v_order_id, auth.uid());
END;
$$;

-- mark_gtins_activated: bulk-flip after successful BG Barcode sync
CREATE OR REPLACE FUNCTION public.mark_gtins_activated(
  p_gtins         text[],
  p_sync_log_id   bigint DEFAULT NULL
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated int;
  v_gtin    text;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'mark_gtins_activated: admin required';
  END IF;

  UPDATE public.gtin_pool
  SET status = 'activated', activated_at = now()
  WHERE gtin = ANY(p_gtins) AND status = 'used';

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  FOREACH v_gtin IN ARRAY p_gtins LOOP
    INSERT INTO public.gtin_audit_log (gtin, event, actor, metadata)
    VALUES (v_gtin, 'activated', auth.uid(),
            jsonb_build_object('sync_log_id', p_sync_log_id));
  END LOOP;

  IF p_sync_log_id IS NOT NULL THEN
    UPDATE public.gtin_sync_log
    SET status = 'success', submitted_at = now()
    WHERE id = p_sync_log_id;
  END IF;

  RETURN v_updated;
END;
$$;

-- void_gtin: any → voided. One-way, no reuse.
CREATE OR REPLACE FUNCTION public.void_gtin(p_gtin text, p_reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'void_gtin: admin required';
  END IF;

  SELECT order_id INTO v_order_id FROM public.gtin_pool WHERE gtin = p_gtin FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'void_gtin: gtin % not in pool', p_gtin;
  END IF;

  UPDATE public.gtin_pool
  SET status = 'voided', voided_at = now(), voided_reason = p_reason
  WHERE gtin = p_gtin;

  INSERT INTO public.gtin_audit_log (gtin, event, order_id, actor, metadata)
  VALUES (p_gtin, 'voided', v_order_id, auth.uid(),
          jsonb_build_object('reason', p_reason));
END;
$$;

-- build_sync_batch: returns a sync-ready batch of used-but-not-activated GTINs
CREATE OR REPLACE FUNCTION public.build_sync_batch(
  p_issuer_id uuid,
  p_method    text DEFAULT 'csv'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_gtins     text[];
  v_log_id    bigint;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'build_sync_batch: admin required';
  END IF;

  IF p_method NOT IN ('csv', 'api', 'manual') THEN
    RAISE EXCEPTION 'build_sync_batch: invalid method %', p_method;
  END IF;

  SELECT array_agg(gtin) INTO v_gtins
  FROM public.gtin_pool
  WHERE issuer_id = p_issuer_id AND status = 'used';

  IF v_gtins IS NULL OR array_length(v_gtins, 1) IS NULL THEN
    RAISE EXCEPTION 'build_sync_batch: no used GTINs awaiting activation';
  END IF;

  INSERT INTO public.gtin_sync_log
    (issuer_id, sync_date, method, gtin_count, gtins, created_by)
  VALUES
    (p_issuer_id, current_date, p_method, array_length(v_gtins, 1), v_gtins, auth.uid())
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- ---------- RLS --------------------------------------------------------------

ALTER TABLE public.gtin_issuers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtin_pool             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtin_product_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtin_audit_log        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtin_sync_log         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gtin_issuers_admin_all" ON public.gtin_issuers;
CREATE POLICY "gtin_issuers_admin_all" ON public.gtin_issuers
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "gtin_pool_admin_all" ON public.gtin_pool;
CREATE POLICY "gtin_pool_admin_all" ON public.gtin_pool
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "gtin_product_records_admin_all" ON public.gtin_product_records;
CREATE POLICY "gtin_product_records_admin_all" ON public.gtin_product_records
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "gtin_audit_admin_read" ON public.gtin_audit_log;
CREATE POLICY "gtin_audit_admin_read" ON public.gtin_audit_log
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "gtin_sync_admin_all" ON public.gtin_sync_log;
CREATE POLICY "gtin_sync_admin_all" ON public.gtin_sync_log
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ---------- Grants (RPC execute) ---------------------------------------------

GRANT EXECUTE ON FUNCTION public.configure_issuer(text, text, public.gtin_symbology, int)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.replenish_pool(uuid, int)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_gtin_for_order(uuid, uuid)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.compose_product_record(text, text, text, text, text, jsonb)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_gtin_used(text)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_gtins_activated(text[], bigint)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.void_gtin(text, text)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.build_sync_batch(uuid, text)
  TO authenticated;
