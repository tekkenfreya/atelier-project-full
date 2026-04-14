-- Add per-country landscape image URLs for botanical extracts.
-- Shape: { "bulgaria": "https://...", "romania": "https://..." }
-- The existing landscape_url column is kept as a fallback for ingredients
-- that have not yet been re-uploaded per country.

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS country_landscapes JSONB DEFAULT '{}'::jsonb;
