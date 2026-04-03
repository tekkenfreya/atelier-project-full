-- Add skincare priorities to ingredients table
-- Values: Anti-aging, Brightening, Hydration, Calming, Clarifying, Repair

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS skincare_priorities text[] DEFAULT '{}';

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
