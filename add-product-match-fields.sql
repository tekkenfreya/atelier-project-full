-- Migration: Add matching engine fields to products table
-- These columns support the consultation quiz matching engine and ERP product management.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS concern_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safe_for_pregnancy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS safe_for_rosacea boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS safe_for_eczema boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS contains_retinol boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS contains_bha boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS contains_pegs boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS contains_fragrance boolean DEFAULT false;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
