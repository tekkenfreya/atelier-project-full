-- Skincare priorities for remaining ingredients
-- Based on Kyrill's Extract Suggestions + ingredient functions

-- Actives
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Matrixyl 3000');
UPDATE ingredients SET skincare_priorities = ARRAY['Hydration']::text[] WHERE LOWER(name) = LOWER('AquaxylTM');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Vitamin C');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging','Brightening']::text[] WHERE LOWER(name) = LOWER('Cosphaderm® Tocopharin');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('SepiliftTM DPHP');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging','Brightening']::text[] WHERE LOWER(name) = LOWER('Stabilized Coenzyme Q10');
UPDATE ingredients SET skincare_priorities = ARRAY['Hydration']::text[] WHERE LOWER(name) = LOWER('DPG');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying']::text[] WHERE LOWER(name) = LOWER('BHA');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Allantoin');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Caffeine');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging','Brightening']::text[] WHERE LOWER(name) = LOWER('Resveratrol 100% Pure Powder');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Brightening']::text[] WHERE LOWER(name) = LOWER('Green tea liposomes');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Oat Protein Powder');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Vitamine E plant-based');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Vitamin E Tocopherol');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Tocopherol d-alpha 70%');

-- EE Botanical Extracts (from Kyrill's Excel)
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Repair']::text[] WHERE LOWER(name) = LOWER('Salix alba (White Willow) Bark Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Calming']::text[] WHERE LOWER(name) = LOWER('Urtica dioica (Nettle) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Betula alba (Birch) Bark Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying']::text[] WHERE LOWER(name) = LOWER('Juniperus communis (Juniper) Berry Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair','Clarifying']::text[] WHERE LOWER(name) = LOWER('Achillea millefolium (Yarrow) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Rosa damascena (Bulgarian Rose) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Melissa officinalis (Lemon Balm) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Vaccinium myrtillus (Bilberry) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Hydration']::text[] WHERE LOWER(name) = LOWER('Sambucus nigra (Elderflower) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming']::text[] WHERE LOWER(name) = LOWER('Centaurea cyanus (Cornflower) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Hydration']::text[] WHERE LOWER(name) = LOWER('Tilia cordata (Linden Blossom) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Calming']::text[] WHERE LOWER(name) = LOWER('Salvia officinalis (Sage) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Equisetum arvense (Horsetail) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Plantago major (Plantain) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Hypericum perforatum (St. John''s Wort) Oil/Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Hypericum perforatum (St. John''s Wort) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) CO2 Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Betula alba (Birch) Sap Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Betula alba (Birch) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Rosmarinus officinalis (Rosemary) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Rosmarinus officinalis (Rosemary) CO2 Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Sambucus nigra (Elderberry) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Vaccinium vitis-idaea (Lingonberry) Seed Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Ribes nigrum (Blackcurrant) Seed Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Vaccinium myrtillus (Bilberry) Seed Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Prunus spinosa (Blackthorn) Kernel Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Arnica montana (Mountain Arnica) Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Centella Asiatica Extract GW');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Centella asiatica GW');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming']::text[] WHERE LOWER(name) = LOWER('Chamomile CO2 Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair']::text[] WHERE LOWER(name) = LOWER('Marigold CO2 extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Hydration']::text[] WHERE LOWER(name) = LOWER('Mallow extract Organic');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Organic Green Tea');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Hydration']::text[] WHERE LOWER(name) = LOWER('Organic Cucumber');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Organic Rosehip seed CO2 extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Carote CO2 extract Organic');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening']::text[] WHERE LOWER(name) = LOWER('Schisandra CO2 extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming']::text[] WHERE LOWER(name) = LOWER('Euphrasia Extract GW');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Calming']::text[] WHERE LOWER(name) = LOWER('Sage CO2 extract antioxidant');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Hydration']::text[] WHERE LOWER(name) = LOWER('Lindenblüten Extrakt GW');
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Repair']::text[] WHERE LOWER(name) = LOWER('Salix Nigra Bark Extract');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming']::text[] WHERE LOWER(name) = LOWER('Rosa Damascena Flower Oil');

-- Duplicate name variants from batch auto-create
UPDATE ingredients SET skincare_priorities = ARRAY['Clarifying','Calming']::text[] WHERE LOWER(name) = LOWER('Urtica dioica Extract (Bulgaria)');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Vaccinium myrtillus Extract (EE)');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming','Repair','Clarifying']::text[] WHERE LOWER(name) = LOWER('Achillea millefolium Extract (Carpathians)');
UPDATE ingredients SET skincare_priorities = ARRAY['Brightening','Anti-aging']::text[] WHERE LOWER(name) = LOWER('Hippophae rhamnoides Extract (EE)');

-- Lipid actives
UPDATE ingredients SET skincare_priorities = ARRAY['Hydration']::text[] WHERE LOWER(name) = LOWER('Jojoba oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Hydration']::text[] WHERE LOWER(name) = LOWER('Sweet Almond Oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Calming']::text[] WHERE LOWER(name) = LOWER('Oat oil');
UPDATE ingredients SET skincare_priorities = ARRAY['Anti-aging']::text[] WHERE LOWER(name) = LOWER('Cranberryöl cold pressed');
UPDATE ingredients SET skincare_priorities = ARRAY['Hydration']::text[] WHERE LOWER(name) = LOWER('Squalane vegetable');

NOTIFY pgrst, 'reload schema';
