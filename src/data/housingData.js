// Demographia International Housing Affordability Survey — market distribution data
// Source: demographia.com, annual editions 2005–2025 (data year = Q3 of prior year)
// "Housing Affordability Ratings by Nation: Totals by Market" (Table ES-2 in each edition)
//
// Metric: % of surveyed markets (metro areas) in each affordability tier
// Tiers use Demographia's "median multiple" (median house price / median household income):
//   affordable:    ≤ 3.0
//   moderate:      3.1 – 4.0
//   serious:       4.1 – 5.0
//   severe:        5.1 – 8.9
//   impossible:    ≥ 9.0
//
// Coverage changed over time (US: 46→56 markets, UK: 15→23 markets from 2023)
// All values expressed as % of total markets surveyed that year → always sum to 100%
//
// Note: UK not included in 1st edition (2004 data). Data shown as null for missing years.

export const bands = [
  { id: "affordable",  label: "≤ 3",    lo: 0,   hi: 3,        color: "#15bc9d" },
  { id: "moderate",   label: "3–4",    lo: 3,   hi: 4,        color: "#5800FF" },
  { id: "serious",    label: "4–5",    lo: 4,   hi: 5,        color: "#b904ca" },
  { id: "severe",     label: "5–9",    lo: 5,   hi: 9,        color: "#f97316" },
  { id: "impossible", label: "9+",     lo: 9,   hi: Infinity,  color: "#dc2626" },
];

// Raw counts per edition: [affordable, moderate, serious, severe, impossible, total]
const raw = {
  AU: {
    2004: [0,0,2,7,0,9],  2005: [0,0,1,8,0,9],  2006: [0,0,2,7,0,9],
    2007: [0,0,1,6,2,9],  2008: [0,0,1,5,3,9],  2009: [0,0,2,5,2,9],
    2010: [0,0,1,4,4,9],  2011: [0,0,2,3,4,9],  2012: [0,0,2,3,4,9],
    2013: [0,0,2,4,3,9],  2014: [0,0,1,4,4,9],  2015: [0,0,1,3,5,9],
    2016: [0,0,0,3,6,9],  2017: [0,0,0,2,7,9],  2018: [0,0,1,2,6,9],
    2019: [0,0,2,4,3,9],  2020: [0,0,2,4,3,9],  2021: [0,0,0,2,7,9],
    2022: [0,0,0,2,7,9],  2023: [0,0,0,2,3,5],  2024: [0,0,0,1,4,5],
  },
  CA: {
    2004: [1,4,3,0,0,8],  2005: [1,3,3,1,0,8],  2006: [0,4,3,1,0,8],
    2007: [0,3,2,3,0,8],  2008: [0,2,2,3,1,8],  2009: [1,3,3,1,0,8],
    2010: [1,3,2,2,0,8],  2011: [2,3,1,2,0,8],  2012: [2,3,1,2,0,8],
    2013: [1,3,2,2,0,8],  2014: [1,2,2,3,0,8],  2015: [1,2,2,2,1,8],
    2016: [1,1,2,2,2,8],  2017: [0,1,2,3,2,8],  2018: [0,1,2,3,2,8],
    2019: [0,1,3,2,2,8],  2020: [0,0,3,3,2,8],  2021: [0,0,0,3,5,8],
    2022: [0,0,1,2,5,8],  2023: [0,1,1,2,2,6],  2024: [0,1,1,2,2,6],
  },
  UK: {
    2004: null,
    2005: [3,2,2,8,0,15], 2006: [1,3,3,8,0,15], 2007: [0,2,3,9,1,15],
    2008: [0,1,2,10,2,15],2009: [0,2,4,8,1,15], 2010: [0,2,5,7,1,15],
    2011: [0,3,5,6,1,15], 2012: [0,4,4,6,1,15], 2013: [0,3,5,6,1,15],
    2014: [0,2,5,7,1,15], 2015: [0,2,4,7,2,15], 2016: [0,2,3,7,3,15],
    2017: [0,2,3,7,3,15], 2018: [0,2,4,6,3,15], 2019: [0,3,4,6,2,15],
    2020: [0,3,5,5,2,15], 2021: [0,1,3,7,4,15], 2022: [0,2,4,7,2,15],
    2023: [0,2,12,9,0,23],2024: [0,2,12,8,1,23],
  },
  US: {
    2004: [22,14,8,2,0,46], 2005: [22,13,7,4,0,46], 2006: [20,11,9,6,0,46],
    2007: [20,10,7,9,0,46], 2008: [16,9,8,12,1,46],  2009: [24,10,5,7,0,46],
    2010: [24,10,5,6,1,46], 2011: [26,9,4,6,1,46],   2012: [28,8,4,5,1,46],
    2013: [29,8,3,5,1,46],  2014: [26,9,5,5,1,46],   2015: [24,9,5,7,1,46],
    2016: [22,9,6,8,1,46],  2017: [20,9,7,9,1,46],   2018: [19,9,7,9,2,46],
    2019: [21,9,6,8,2,46],  2020: [20,9,6,8,3,46],   2021: [14,7,7,12,6,46],
    2022: [12,7,8,13,6,46], 2023: [0,11,23,17,5,56],  2024: [0,11,22,17,6,56],
  },
};

// Convert raw counts to % of total for each year
function toPercents(counts) {
  const total = counts[5];
  return counts.slice(0, 5).map(v => Math.round((v / total) * 1000) / 10);
}

export const countries = [
  { id: "AU", label: "Australia",      markets: "9–5 major markets"  },
  { id: "CA", label: "Canada",         markets: "8–6 major markets"  },
  { id: "UK", label: "United Kingdom", markets: "15–23 major markets" },
  { id: "US", label: "United States",  markets: "46–56 major markets" },
].map(c => ({
  ...c,
  data: Object.entries(raw[c.id])
    .filter(([, v]) => v !== null)
    .map(([year, counts]) => ({
      year: +year,
      pcts: toPercents(counts),
      total: counts[5],
    })),
}));

export const years = Array.from(
  { length: 2024 - 2004 + 1 },
  (_, i) => 2004 + i
);