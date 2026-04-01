// Sources:
// Minimum wage: Eurostat / Euronews, January 2025
// Cost of living: Numbeo 2025, estimated monthly expenses (rent + food + transport + utilities)
// Countries without statutory minimum wage marked with note
// All values in EUR/month

export const wageVsCostData = [
  // High wage countries
  { country: "Luxembourg",      minWage: 2638, costOfLiving: 2900 },
  { country: "Netherlands",     minWage: 2070, costOfLiving: 2100 },
  { country: "Germany",         minWage: 2054, costOfLiving: 2200 },
  { country: "Ireland",         minWage: 2146, costOfLiving: 2600 },
  { country: "Belgium",         minWage: 1994, costOfLiving: 2000 },
  { country: "France",          minWage: 1767, costOfLiving: 1900 },

  // Medium wage countries
  { country: "Spain",           minWage: 1323, costOfLiving: 1500 },
  { country: "Slovenia",        minWage: 1254, costOfLiving: 1300 },
  { country: "Poland",          minWage: 1091, costOfLiving: 1100 },
  { country: "Lithuania",       minWage: 1038, costOfLiving: 1000 },
  { country: "Portugal",        minWage: 1015, costOfLiving: 1300 },
  { country: "Cyprus",          minWage: 1000, costOfLiving: 1400 },

  // Lower medium wage countries
  { country: "Croatia",         minWage: 970,  costOfLiving: 1100 },
  { country: "Greece",          minWage: 968,  costOfLiving: 1200 },
  { country: "Malta",           minWage: 961,  costOfLiving: 1300 },
  { country: "Estonia",         minWage: 886,  costOfLiving: 1100 },
  { country: "Czechia",         minWage: 826,  costOfLiving: 1100 },
  { country: "Slovakia",        minWage: 816,  costOfLiving: 950  },
  { country: "Romania",         minWage: 814,  costOfLiving: 800  },
  { country: "Hungary",         minWage: 701,  costOfLiving: 850  },
  { country: "Latvia",          minWage: 740,  costOfLiving: 950  },

  // Low wage countries
  { country: "Bulgaria",        minWage: 551,  costOfLiving: 700  },
  { country: "Serbia",          minWage: 544,  costOfLiving: 700  },
  { country: "Montenegro",      minWage: 533,  costOfLiving: 750  },
  { country: "Albania",         minWage: 385,  costOfLiving: 600  },
  { country: "North Macedonia",  minWage: 380,  costOfLiving: 600  },
  { country: "Moldova",         minWage: 285,  costOfLiving: 450  },
];