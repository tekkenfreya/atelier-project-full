-- Admin order dashboard support
-- Adds fulfillment/print tracking columns to customer_orders and grants admins RLS access.

ALTER TABLE public.customer_orders
  ADD COLUMN IF NOT EXISTS printed_at timestamptz,
  ADD COLUMN IF NOT EXISTS fulfilled_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_shipment_at timestamptz;

-- Admin read/update access (OR'd with any existing per-user policy)
DROP POLICY IF EXISTS "customer_orders_admin_all" ON public.customer_orders;
CREATE POLICY "customer_orders_admin_all" ON public.customer_orders
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
