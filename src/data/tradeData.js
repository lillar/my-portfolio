// Voedingscentrum Schijf van Vijf 2026 — personal recommendations
// Sources: CBS StatLine 2023, Wageningen UR, VLAM, Nature Food (Stehl et al. 2025)
//
// 5 main categories match the official Schijf van Vijf sections (2026)
// Subcategories follow the exact order from voedingscentrum.nl recommendations
//
// weeklyG:      recommended weekly amount in grams or ml (daily × 7 or weekly)
// unit:         "g" or "ml"
// frequency:    "daily" or "weekly" (original cadence)
// domesticPct:  % of NL consumption covered by NL domestic production
// importPct:    100 - domesticPct (imported share)
// exportPct:    NL exports as % of domestic consumption
//               (>100 means NL exports more than it consumes domestically)

export const groups = [
  {
    id: "groente_fruit",
    label: "Groente & fruit",
    color: "#4caf50",   // green
    subcategories: [
      {
        id: "vegetables",
        label: "Vegetables",
        weeklyG: 1750,      // 250g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 88,
        importPct: 12,
        exportPct: 320,
        note: "Tomatoes, peppers, cucumber — NL 2nd largest veg exporter",
      },
      {
        id: "fruit",
        label: "Fruit",
        weeklyG: 1400,      // 200g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 32,    // Apples, pears NL; bananas, citrus, grapes imported
        importPct: 68,
        exportPct: 85,      // NL re-exports a lot via Rotterdam
        note: "Apples/pears NL; bananas & citrus fully imported",
      },
    ],
  },
  {
    id: "brood_granen",
    label: "Brood, granen & aardappelen",
    color: "#85631e",   // brown
    subcategories: [
      {
        id: "bread",
        label: "Bread & breakfast cereals",
        weeklyG: 1225,      // 175g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 28,
        importPct: 72,
        exportPct: 60,
        note: "Wheat mostly from France, Germany; NL bakes but doesn't grow enough",
      },
      {
        id: "grains",
        label: "Wholegrains & potatoes",
        weeklyG: 1400,      // 200g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 52,    // Potatoes 100% NL; rice 0%; pasta ~30%
        importPct: 48,
        exportPct: 180,
        note: "Potatoes fully NL; rice from Asia; pasta from EU durum wheat",
      },
    ],
  },
  {
    id: "zuivel_vlees",
    label: "Zuivel, vlees, vis, ei, peulvruchten & noten",
    color: "#b904ca",   // pink
    subcategories: [
      {
        id: "dairy",
        label: "Dairy & alternatives",
        weeklyG: 2800,      // 400ml/day × 7
        unit: "ml",
        frequency: "daily",
        domesticPct: 90,
        importPct: 10,
        exportPct: 210,
        note: "Milk, yoghurt NL; soy drink soy from Brazil/USA",
      },
      {
        id: "cheese",
        label: "Cheese",
        weeklyG: 140,       // 20g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 95,
        importPct: 5,
        exportPct: 380,
        note: "Gouda, Edam — NL largest EU cheese exporter",
      },
      {
        id: "nuts",
        label: "Unsalted nuts",
        weeklyG: 210,       // 30g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 2,
        importPct: 98,
        exportPct: 8,
        note: "Peanuts (Argentina/USA), walnuts (USA), pistachios (Iran)",
      },
      {
        id: "legumes",
        label: "Legumes, tofu & tempeh",
        weeklyG: 250,
        unit: "g",
        frequency: "weekly",
        domesticPct: 8,
        importPct: 92,
        exportPct: 12,
        note: "Beans (Canada), soy/tofu (Asia), chickpeas (Turkey)",
      },
      {
        id: "fish",
        label: "Fish",
        weeklyG: 100,
        unit: "g",
        frequency: "weekly",
        domesticPct: 30,
        importPct: 70,
        exportPct: 140,
        note: "Herring NL; salmon from Norway; tuna from Pacific",
      },
      {
        id: "eggs",
        label: "Eggs",
        weeklyG: 195,       // 3 eggs × ~65g
        unit: "g",
        frequency: "weekly",
        domesticPct: 90,
        importPct: 10,
        exportPct: 220,
        note: "NL 5th largest EU egg producer; exports ~60%",
      },
      {
        id: "meat_white",
        label: "White meat",
        weeklyG: 200,       // ~200g of the 300g total
        unit: "g",
        frequency: "weekly",
        domesticPct: 92,
        importPct: 8,
        exportPct: 280,
        note: "Chicken, pork — NL major producer and exporter",
      },
      {
        id: "meat_red",
        label: "Red meat (max)",
        weeklyG: 100,       // max 100g/week
        unit: "g",
        frequency: "weekly",
        domesticPct: 88,
        importPct: 12,
        exportPct: 240,
        note: "Beef largely NL; max 100g/week recommended",
      },
    ],
  },
  {
    id: "vetten",
    label: "Smeer- en bereidingsvetten",
    color: "#ffc600",   // yellow
    subcategories: [
      {
        id: "fats",
        label: "Fats & oils",
        weeklyG: 315,       // 45g/day × 7
        unit: "g",
        frequency: "daily",
        domesticPct: 22,
        importPct: 78,
        exportPct: 55,
        note: "Olive oil 100% imported; margarine from imported oils",
      },
    ],
  },
  {
    id: "dranken",
    label: "Dranken",
    color: "#64b5f6",   // blue
    subcategories: [
      {
        id: "drinks",
        label: "Drinks",
        weeklyG: 9800,      // 1400ml/day × 7
        unit: "ml",
        frequency: "daily",
        domesticPct: 72,    // Tap water 100% NL; coffee/tea 0%
        importPct: 28,
        exportPct: 40,
        note: "Tap water 100% NL; coffee & tea fully imported",
      },
    ],
  },
];

// Flat list of all subcategories in order (for bar chart)
export const categories = groups.flatMap(g =>
  g.subcategories.map(s => ({ ...s, groupId: g.id, groupLabel: g.label, groupColor: g.color }))
);

export const totalWeeklyG = categories.reduce((s, c) => s + c.weeklyG, 0);