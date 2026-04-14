-- Add country of origin (multi-select) and free-text description
-- to ingredients table. Used by botanical extracts to populate the
-- customer dashboard extract origin map.

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS origin_description TEXT;

-- GIN index to make "find ingredients sourced from country X" queries fast.
CREATE INDEX IF NOT EXISTS ingredients_country_of_origin_idx
  ON ingredients USING GIN (country_of_origin);
