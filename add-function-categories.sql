CREATE TABLE IF NOT EXISTS public.ingredient_function_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.ingredient_function_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON public.ingredient_function_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage" ON public.ingredient_function_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon read categories" ON public.ingredient_function_categories;
CREATE POLICY "Allow anon read categories" ON public.ingredient_function_categories FOR SELECT TO anon USING (true);

INSERT INTO public.ingredient_function_categories (name, sort_order) VALUES
  ('Solvent', 1),
  ('Humectant', 2),
  ('Emulsifier', 3),
  ('Lipid', 4),
  ('Thickener / Stabiliser', 5),
  ('Preservative', 6),
  ('Chelating Agent', 7),
  ('pH Adjuster', 8),
  ('Antioxidant', 9),
  ('Active Phase-Shot', 10),
  ('EE Botanical Extract', 11),
  ('Other', 12)
ON CONFLICT (name) DO NOTHING;

NOTIFY pgrst, 'reload schema';
