-- Customer quiz results and orders tables

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  answers jsonb NOT NULL,
  skin_type text NOT NULL,
  concerns text[] DEFAULT '{}',
  recommended_serum text,
  recommended_cleanser text,
  recommended_moisturizer text,
  fragrance_choice text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.customer_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  subscription_plan text NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  shipping_name text,
  shipping_email text,
  shipping_address text,
  shipping_city text,
  shipping_country text,
  shipping_postal_code text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own quiz results" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON public.customer_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.customer_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anon read for the API routes (server-side)
CREATE POLICY "Allow anon read quiz_results" ON public.quiz_results FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert quiz_results" ON public.quiz_results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read customer_orders" ON public.customer_orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert customer_orders" ON public.customer_orders FOR INSERT TO anon WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
