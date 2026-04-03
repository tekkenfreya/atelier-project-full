-- Normalize all ingredient functions to 12 basic categories

-- → Solvent
UPDATE ingredients SET "function" = 'Solvent' WHERE "function" = 'Solvent';

-- → Humectant
UPDATE ingredients SET "function" = 'Humectant' WHERE "function" IN ('Humectant', 'Humectant/Solvent');

-- → Emulsifier
UPDATE ingredients SET "function" = 'Emulsifier' WHERE "function" IN ('Emulsifier', 'Anionic emulsifier', 'Non-ionic emulsifier', 'Anionic surfactant', 'Bio Surfactant', 'Surfactant', 'Non-ionic surfactant', 'Nonionic surfactant / Thickener', 'Amphoteric surfactant', 'Cationic Polymer');

-- → Lipid
UPDATE ingredients SET "function" = 'Lipid' WHERE "function" IN ('Lipid', 'Lipid / Emollient', 'Lipid/emollient', 'Lipid / Active', 'Emollient', 'Moisturiser', 'Consistency Factor', 'Superfatting Agent', 'Superfatting agent');

-- → Thickener / Stabiliser
UPDATE ingredients SET "function" = 'Thickener / Stabiliser' WHERE "function" IN ('Thickener / Stabiliser', 'Thickener + stabiliser', 'Thickener / Rheology Modifier', 'Gum / Polymer', 'Gum/Polymer', 'Gum/polymer', 'Film-former', 'Film-forming agent');

-- → Preservative
UPDATE ingredients SET "function" = 'Preservative' WHERE "function" IN ('Preservative', 'Broad spectrum preservative');

-- → Chelating Agent
UPDATE ingredients SET "function" = 'Chelating Agent' WHERE "function" = 'Chelating Agent';

-- → pH Adjuster
UPDATE ingredients SET "function" = 'pH Adjuster' WHERE "function" IN ('pH Adjuster', 'pH adjuster', 'Neutralising agent');

-- → Antioxidant
UPDATE ingredients SET "function" = 'Antioxidant' WHERE "function" IN ('Antioxidant', 'Active/Antioxidant');

-- → Active Phase-Shot
UPDATE ingredients SET "function" = 'Active Phase-Shot' WHERE "function" IN ('Active Phase-Shot', 'Active', 'Active (BHA)', 'Active (PHA)', 'Active (Peptide)', 'Active (Retinoid)', 'Active (Retinol alternative)', 'Active (Hydrating)', 'Active (Antioxidant)', 'Active (Azelaic Acid derivative)', 'Active / Soothing', 'Active / Soothing Agent', 'Active / Barrier Support', 'Active (Barrier Support)', 'Barrier Support');

-- → EE Botanical Extract
UPDATE ingredients SET "function" = 'EE Botanical Extract' WHERE "function" IN ('EE Botanical Extract', 'Extract', 'Extract EE', 'Botanical Extract', 'Flower Oil');

-- → Other
UPDATE ingredients SET "function" = 'Other' WHERE "function" IN ('Other', 'Fragrance', 'Scent / Aroma', 'Scent / Aroma agent', 'Alchohol / Scented', 'Organic Compound', 'Gas', 'GAS', 'Serum Vehicle/Base', 'Minimalist Cream Base', 'Oil Base', 'Cleanser Gel Base CO4/CO5', 'Cream Base');

-- Fill remaining NULLs by name
UPDATE ingredients SET "function" = 'Humectant' WHERE "function" IS NULL AND name IN ('Butylene Glycol');
UPDATE ingredients SET "function" = 'Preservative' WHERE "function" IS NULL AND name IN ('ISCAGUARD IAF', 'Geogard ECT');
UPDATE ingredients SET "function" = 'Thickener / Stabiliser' WHERE "function" IS NULL AND name IN ('Pemulen TR1', 'VP/VA Copolymer GC', 'Solagum AX');
UPDATE ingredients SET "function" = 'Emulsifier' WHERE "function" IS NULL AND name IN ('Olivem 1000', 'Fluidifeel Easy (Seppic)', 'Fluidifeel Easy', 'Emulgade 1000 NI', 'Polyglyceryl-4 Oleate');
UPDATE ingredients SET "function" = 'Lipid' WHERE "function" IS NULL AND name IN ('Capric/Caprylic Triglycerides', 'Caprylic/capric triglycerides', 'Sunflower oil (High Oleic)', 'Glyceryl stearate', 'Sweet Almond Oil', 'Oat oil', 'Cranberryöl cold pressed', 'Peg-6 caprylic/capric glycerides');
UPDATE ingredients SET "function" = 'Active Phase-Shot' WHERE "function" IS NULL AND name IN ('Panthenol', 'Allantoin', 'Caffeine', 'Oat Protein Powder');
UPDATE ingredients SET "function" = 'Antioxidant' WHERE "function" IS NULL AND name IN ('Tocopherol d-alpha 70%', 'Resveratrol 100% Pure Powder', 'Green tea liposomes');

-- Catch-all: any remaining NULLs with Extract in the name
UPDATE ingredients SET "function" = 'EE Botanical Extract' WHERE "function" IS NULL AND (name LIKE '%Extract%' OR name LIKE '%extract%' OR name LIKE '%Oil%' AND (name LIKE '%Seed%' OR name LIKE '%CO2%'));

-- Catch-all: anything still NULL gets Other
UPDATE ingredients SET "function" = 'Other' WHERE "function" IS NULL OR "function" = '';

NOTIFY pgrst, 'reload schema';
