const XLSX = require("xlsx");
const results = require("./docs/test-results-raw.json");

const wb = XLSX.utils.book_new();

// Sheet 1: Summary
const summaryData = results.map((r) => ({
  "Test #": r.testId,
  "Test Name": r.testName,
  "Result": r.winner,
  "Score": r.score,
  "Skin Type": r.skinType,
  "Concerns Detected": r.concerns.join(", "),
  "Matched Concerns": r.matchedConcerns.join(", "),
  "Reasons": r.reasons.join(" | "),
  "Data Source": r.usedConcernTags ? "Concern Tags" : r.hasGap ? "N/A" : "Layer 2 (Ingredients)",
  "Has Gap": r.hasGap ? "YES" : "NO",
  "Gap Message": r.gapMessage || "",
}));
const ws1 = XLSX.utils.json_to_sheet(summaryData);
ws1["!cols"] = [
  { wch: 7 }, { wch: 40 }, { wch: 10 }, { wch: 7 }, { wch: 14 },
  { wch: 30 }, { wch: 30 }, { wch: 60 }, { wch: 20 }, { wch: 8 }, { wch: 50 },
];
XLSX.utils.book_append_sheet(wb, ws1, "Summary");

// Sheet 2: Quiz Answers (all Q1-Q30 for each test)
const questionLabels = {
  1: "Q1 Age",
  2: "Q2 Biological Sex",
  3: "Q3 Region",
  4: "Q4 Environment",
  5: "Q5 Water Intake (1-5)",
  6: "Q6 Sleep Hours (1-5)",
  7: "Q7 Stress Level (1-5)",
  8: "Q8 Diet (grid)",
  9: "Q9 Sun Exposure (1-5)",
  10: "Q10 Pregnant?",
  11: "Q11 Skin Type",
  12: "Q12 Skin Concerns",
  13: "Q13 Sun Sensitivity (1-5)",
  14: "Q14 Post-Cleanse Feel",
  15: "Q15 Breakout Frequency",
  16: "Q16 Skin Conditions",
  17: "Q17 Pore Visibility (1-5)",
  18: "Q18 Skin Tone",
  19: "Q19 Current Skin State (grid)",
  20: "Q20 Allergic Reactions",
  21: "Q21 Routine Steps",
  22: "Q22 Moisturizer Texture",
  23: "Q23 Cleanser Type",
  24: "Q24 Priority Ranking",
  25: "Q25 Ingredient Philosophy",
  26: "Q26 Adventurousness (1-5)",
  27: "Q27 Retinol Experience",
  28: "Q28 Routine Time",
  29: "Q29 Ingredient Exclusions",
  30: "Q30 Free Text",
};

const answerRows = results.map((r) => {
  const row = { "Test #": r.testId, "Test Name": r.testName };
  for (let q = 1; q <= 30; q++) {
    const val = r.quizAnswers[q];
    if (val === null || val === undefined) {
      row[questionLabels[q]] = "";
    } else if (Array.isArray(val)) {
      row[questionLabels[q]] = val.join("; ");
    } else if (typeof val === "object") {
      row[questionLabels[q]] = Object.entries(val).map(([k, v]) => k + ": " + v).join("; ");
    } else {
      row[questionLabels[q]] = String(val);
    }
  }
  row["RESULT"] = r.winner;
  return row;
});
const ws2 = XLSX.utils.json_to_sheet(answerRows);
XLSX.utils.book_append_sheet(wb, ws2, "Quiz Answers");

// Sheet 3: Safety Flag Check
const safetyRows = results.map((r) => ({
  "Test #": r.testId,
  "Test Name": r.testName,
  "Winner": r.winner,
  "Q10 Pregnant": r.quizAnswers[10] || "",
  "Q16 Conditions": Array.isArray(r.quizAnswers[16]) ? r.quizAnswers[16].join("; ") : "",
  "Q29 Exclusions": Array.isArray(r.quizAnswers[29]) ? r.quizAnswers[29].join("; ") : "",
  "Product: safe_for_pregnancy": r.safetyFlags ? String(r.safetyFlags.safe_for_pregnancy) : "N/A",
  "Product: safe_for_rosacea": r.safetyFlags ? String(r.safetyFlags.safe_for_rosacea) : "N/A",
  "Product: safe_for_eczema": r.safetyFlags ? String(r.safetyFlags.safe_for_eczema) : "N/A",
  "Product: contains_retinol": r.safetyFlags ? String(r.safetyFlags.contains_retinol) : "N/A",
  "Product: contains_bha": r.safetyFlags ? String(r.safetyFlags.contains_bha) : "N/A",
  "Product: contains_pegs": r.safetyFlags ? String(r.safetyFlags.contains_pegs) : "N/A",
  "Product: contains_fragrance": r.safetyFlags ? String(r.safetyFlags.contains_fragrance) : "N/A",
}));
const ws3 = XLSX.utils.json_to_sheet(safetyRows);
XLSX.utils.book_append_sheet(wb, ws3, "Safety Flags");

// Sheet 4: Gate-by-Gate Logic Explanation
const gateRows = [
  {
    "Test #": 1, "Test Name": "Young oily urban female - Breakouts",
    "Gate 1 (Skin Type)": "Q11=Oily -> Filter to oily serums only (SO1-SO5)",
    "Gate 2 (Safety)": "Q10=No (not pregnant), Q16=None, Q29=Nothing excluded. No products removed. 5 remain.",
    "Gate 3 (Scoring)": "Q12=[Breakouts, Oiliness] -> concerns: acne, oil-control. Q24 #1=Clarifying -> acne gets 3x multiplier. SO1 has Salicylic Acid+Zinc PCA (acne+oil-control via Layer 2). Score: acne(3x=30) + oil-control(1x=10) + active bonus(4) = 44. SO2-SO5 don't match acne.",
    "Winner": "SO1 (Score: 44)",
    "Source": "Layer 2",
  },
  {
    "Test #": 2, "Test Name": "Mature dry rural female - Anti-aging",
    "Gate 1 (Skin Type)": "Q11=Dry -> Filter to dry serums (SD2,SD3,SD4,SD09,SD10,SD12,LF SD12,SD9)",
    "Gate 2 (Safety)": "Q10=No, Q16=None, Q29=Nothing excluded. All 8 remain.",
    "Gate 3 (Scoring)": "Q12=[Fine lines, Firmness, Dryness] -> concerns: anti-aging, hydration. Q24 #1=Anti-aging(3x), #2=Hydration(2x). SD9 has concern tags including Fine lines+Dryness -> matches anti-aging(3x=30) + hydration(2x=20) + active bonus(2) = 52. Highest score.",
    "Winner": "SD9 (Score: 52)",
    "Source": "Concern Tags",
  },
  {
    "Test #": 3, "Test Name": "Young oily male - Anti-aging NO retinol",
    "Gate 1 (Skin Type)": "Q11=Oily -> 5 oily serums (SO1-SO5)",
    "Gate 2 (Safety)": "Q29=[Retinol] -> Check ingredient map: SO4 has Retinol Liposome OS, SymRenew HPR -> REMOVED. 4 remain: SO1,SO2,SO3,SO5.",
    "Gate 3 (Scoring)": "Q12=[Fine lines] -> concern: anti-aging. Q24 #1=Anti-aging. But SO1/SO2/SO3 don't have anti-aging ingredients. SO5 has Bakuchiol -> maps to anti-aging-gentle, NOT anti-aging. No product matches the concern. All tie at base score. SO1 wins on active ingredient count.",
    "Winner": "SO1 (Score: 4) - KNOWN ISSUE: SO5 should win",
    "Source": "Layer 2",
  },
  {
    "Test #": 4, "Test Name": "Pregnant oily female - Breakouts",
    "Gate 1 (Skin Type)": "Q11=Oily -> 5 oily serums",
    "Gate 2 (Safety)": "Q10=Yes(pregnant) -> Retinol excluded. SO4 has retinol -> REMOVED. Q29=[Retinol, BHA] -> SO1 has Salicylic Acid(BHA) -> REMOVED via ingredient map. 3 remain: SO2,SO3,SO5.",
    "Gate 3 (Scoring)": "Q12=[Breakouts, Oiliness] -> concerns: acne, oil-control. Q24 #1=Clarifying(3x on acne). SO3 has Niacinamide -> oil-control(1x=10) + active bonus(4) = 14. SO2 matches oil-control similarly. SO3 wins on active count.",
    "Winner": "SO3 (Score: 14)",
    "Source": "Layer 2",
  },
  {
    "Test #": 5, "Test Name": "Dry + Rosacea - Calming",
    "Gate 1 (Skin Type)": "Q11=Dry -> 8 dry serums",
    "Gate 2 (Safety)": "Q16=[Rosacea] -> BHA excluded. Q29=[Fragrance, BHA]. Fragrance skipped (customer choice). BHA excluded via ingredient map. No dry serums have BHA. SD9 has safe_for_rosacea=false -> REMOVED via safety flags. 7 remain.",
    "Gate 3 (Scoring)": "Q12=[Redness, Sensitivity, Dryness] -> concerns: calming, hydration. Q24 #1=Calming(3x), #2=Hydration(2x). SD2 has Ectoin+Bisabolol(calming) + Panthenol(hydration) via Layer 2. Score: calming(3x=30) + hydration(2x=20) + active bonus(4) = 54.",
    "Winner": "SD2 (Score: 54)",
    "Source": "Layer 2",
  },
  {
    "Test #": 6, "Test Name": "Dry + Eczema - Hydration",
    "Gate 1 (Skin Type)": "Q11=Dry -> 8 dry serums",
    "Gate 2 (Safety)": "Q16=[Eczema] -> Fragrance excluded (safety). Check ingredient map: SD09 has Parfum -> REMOVED. Check safety flags: SD9 has safe_for_eczema=false -> REMOVED. Q29=[Fragrance] skipped (customer choice). 6 remain.",
    "Gate 3 (Scoring)": "Q12=[Dryness, Sensitivity, Texture] -> concerns: hydration, calming, repair. Q24 #1=Hydration(3x), #2=Repair(2x), #3=Calming(1.5x). SD2 matches all 3 via Layer 2. Score: hydration(3x=30) + repair(2x=20) + calming(1.5x=15) + active bonus(4) = 69.",
    "Winner": "SD2 (Score: 69)",
    "Source": "Layer 2",
  },
  {
    "Test #": 7, "Test Name": "Combination - Brightening",
    "Gate 1 (Skin Type)": "Q11=Combination -> 6 combination serums (SC1-SC6)",
    "Gate 2 (Safety)": "Q10=No, Q16=[Melasma], Q29=Nothing excluded. Melasma has no exclusion rule. SC3 has safe_for_pregnancy=false but customer is not pregnant. All 6 remain.",
    "Gate 3 (Scoring)": "Q12=[Dark spots, Dullness] -> concerns: hyperpigmentation, brightening. Q24 #1=Brightening(3x). SC3 has concern tags including both -> brightening(3x=30) + hyperpigmentation(1x=10) + active bonus(4) = 44.",
    "Winner": "SC3 (Score: 44)",
    "Source": "Concern Tags",
  },
  {
    "Test #": 8, "Test Name": "Sensitive - Calming",
    "Gate 1 (Skin Type)": "Q11=Sensitive -> 6 sensitive serums (SS1-SS6)",
    "Gate 2 (Safety)": "Q29=[Fragrance, Retinol, BHA]. Fragrance skipped. Retinol + BHA checked. No sensitive serums flagged with retinol/BHA in safety flags or ingredient map. All 6 remain.",
    "Gate 3 (Scoring)": "Q12=[Redness, Sensitivity] -> concern: calming. Q24 #1=Calming(3x). SS1 has concern tags matching calming. Score: calming(3x=30) + active bonus(4) = 34.",
    "Winner": "SS1 (Score: 34)",
    "Source": "Concern Tags",
  },
  {
    "Test #": 9, "Test Name": "Oily male - No BHA, No PEGs",
    "Gate 1 (Skin Type)": "Q11=Oily -> 5 oily serums",
    "Gate 2 (Safety)": "Q29=[BHA, PEGs]. SO1 has Salicylic Acid(BHA) -> REMOVED via ingredient map. No oily serums flagged with PEGs. 4 remain: SO2,SO3,SO4,SO5.",
    "Gate 3 (Scoring)": "Q12=[Breakouts, Pores, Oiliness] -> concerns: acne, oil-control. Q24 #1=Clarifying(3x on acne). No remaining products match acne via Layer 2. SO3 has Niacinamide -> oil-control(1x=10) + active bonus(4) = 14.",
    "Winner": "SO3 (Score: 14)",
    "Source": "Layer 2",
  },
  {
    "Test #": 10, "Test Name": "Dry - Repair + Hydration + Calming",
    "Gate 1 (Skin Type)": "Q11=Dry -> 8 dry serums",
    "Gate 2 (Safety)": "Q10=No, Q16=None, Q29=Nothing excluded. All 8 remain.",
    "Gate 3 (Scoring)": "Q12=[Texture, Dryness, Sensitivity] -> concerns: repair, hydration, calming. Q24 #1=Repair(3x), #2=Hydration(2x), #3=Calming(1.5x). SD2 matches all 3 via Layer 2 (Panthenol->repair+hydration, Ectoin+Bisabolol->calming). Score: repair(3x=30) + hydration(2x=20) + calming(1.5x=15) + active bonus(4) = 69.",
    "Winner": "SD2 (Score: 69)",
    "Source": "Layer 2",
  },
  {
    "Test #": 11, "Test Name": "Oily + Eczema (gap)",
    "Gate 1 (Skin Type)": "Q11=Oily -> 5 oily serums",
    "Gate 2 (Safety)": "Q16=[Eczema] -> Fragrance excluded (safety). All 5 oily serums have Parfum (via ingredient map) -> ALL REMOVED. 0 remain.",
    "Gate 3 (Scoring)": "N/A - no products to score.",
    "Winner": "GAP",
    "Source": "N/A",
  },
];
const ws4 = XLSX.utils.json_to_sheet(gateRows);
ws4["!cols"] = [
  { wch: 7 }, { wch: 35 }, { wch: 60 }, { wch: 80 }, { wch: 100 }, { wch: 25 }, { wch: 15 },
];
XLSX.utils.book_append_sheet(wb, ws4, "Gate Logic");

const outPath = "C:/Users/Egofoxxx/Documents/Development Area/Web Development Kyrill/docs/Matching-Engine-Test-Report.xlsx";
XLSX.writeFile(wb, outPath);
console.log("Excel report saved to:", outPath);
