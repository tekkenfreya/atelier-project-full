-- Update ingredient function field to mark extracts
-- Based on Kyrill's Formula Matrix Excel - Ingredient Index sheet

-- EE Botanical Extracts
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Achillea millefolium (Yarrow) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Betula alba (Birch) Bark Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Betula alba (Birch) Sap Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Betula alba (Birch) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Calendula officinalis (Marigold) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Calendula officinalis (Marigold) CO2 Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Centaurea cyanus (Cornflower) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Equisetum arvense (Horsetail) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) CO2 Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hippophae rhamnoides (Sea Buckthorn) Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hippophae rhamnoides Extract (EE)');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hypericum perforatum (St. John''s Wort) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Hypericum perforatum (St. John''s Wort) Oil/Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Juniperus communis (Juniper) Berry Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Matricaria chamomilla (Chamomile) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Matricaria chamomilla (Chamomile) CO2 Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Melissa officinalis (Lemon Balm) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Plantago major (Plantain) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Prunus spinosa (Blackthorn) Kernel Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Ribes nigrum (Blackcurrant) Seed Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Rosa canina (Rosehip) Seed Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Rosa damascena (Bulgarian Rose) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Rosmarinus officinalis (Rosemary) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Rosmarinus officinalis (Rosemary) CO2 Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Salix alba (White Willow) Bark Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Salvia officinalis (Sage) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Sambucus nigra (Elderberry) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Sambucus nigra (Elderflower) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Tilia cordata (Linden Blossom) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Urtica dioica (Nettle) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Urtica dioica Extract (Bulgaria)');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Vaccinium myrtillus (Bilberry) Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Vaccinium myrtillus Extract (EE)');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Vaccinium myrtillus (Bilberry) Seed Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Vaccinium vitis-idaea (Lingonberry) Seed Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Achillea millefolium Extract (Carpathians)');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Arnica montana (Mountain Arnica) Extract');

-- EE Botanical Extracts (alternate names from original DB)
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Euphrasia Extract GW');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Lindenblüten Extrakt GW');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Chamomile CO2 Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Marigold CO2 extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Sage CO2 extract antioxidant');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Salix Nigra Bark Extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Schisandra CO2 extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Carote CO2 extract Organic');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Rosa Damascena Flower Oil');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Organic Rosehip seed CO2 extract');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Mallow extract Organic');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Centella Asiatica Extract GW');
UPDATE ingredients SET function = 'EE Botanical Extract' WHERE LOWER(name) = LOWER('Centella asiatica GW');

-- Regular Botanical Extracts (non-EE)
UPDATE ingredients SET function = 'Botanical Extract' WHERE LOWER(name) = LOWER('Organic Green Tea');
UPDATE ingredients SET function = 'Botanical Extract' WHERE LOWER(name) = LOWER('Green tea liposomes');
UPDATE ingredients SET function = 'Botanical Extract' WHERE LOWER(name) = LOWER('Organic Cucumber');

NOTIFY pgrst, 'reload schema';
