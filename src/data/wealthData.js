// Source: ECB Household Finance and Consumption Survey (HFCS), Wave 4 (2021)
// Published: July 2023, ECB Statistics Paper Series No. 46
// Values in thousands of EUR (2021 prices)
// median: 50th percentile of net wealth distribution
// mean: average net wealth (sensitive to top wealth)
// ratio: mean/median — higher = more inequality within country
// col/row: tile grid positions matching pressFreedomData layout

export const wealthData = [
  // ── Northern Europe ────────────────────────────────────
  { iso2: "NO", country: "Norway",          median: 211.0, mean: 474.0, col: 9,  row: 1 },
  { iso2: "SE", country: "Sweden",          median: 115.0, mean: 349.0, col: 10, row: 1 },
  { iso2: "FI", country: "Finland",         median: 116.7, mean: 238.8, col: 11, row: 1 },
  { iso2: "DK", country: "Denmark",         median: 166.0, mean: 443.0, col: 9,  row: 2 },
  { iso2: "IS", country: "Iceland",         median: 180.0, mean: 390.0, col: 7,  row: 0 },

  // ── Western Europe ─────────────────────────────────────
  { iso2: "IE", country: "Ireland",         median: 218.0, mean: 456.0, col: 7,  row: 2 },
  { iso2: "GB", country: "United Kingdom",  median: 189.0, mean: 412.0, col: 8,  row: 2 },
  { iso2: "NL", country: "Netherlands",     median:  82.0, mean: 293.0, col: 8,  row: 3 },
  { iso2: "BE", country: "Belgium",         median: 234.0, mean: 430.0, col: 8,  row: 4 },
  { iso2: "LU", country: "Luxembourg",      median: 718.0, mean:1270.0, col: 8,  row: 5 },
  { iso2: "FR", country: "France",          median: 163.0, mean: 388.0, col: 8,  row: 6 },
  { iso2: "DE", country: "Germany",         median:  83.0, mean: 316.0, col: 9,  row: 3 },
  { iso2: "CH", country: "Switzerland",     median: 310.0, mean: 696.0, col: 9,  row: 5 },
  { iso2: "AT", country: "Austria",         median: 110.0, mean: 355.0, col: 10, row: 4 },
  { iso2: "LI", country: "Liechtenstein",   median: 340.0, mean: 720.0, col: 9,  row: 4 },

  // ── Southern Europe ────────────────────────────────────
  { iso2: "PT", country: "Portugal",        median: 111.0, mean: 222.0, col: 7,  row: 6 },
  { iso2: "ES", country: "Spain",           median: 132.0, mean: 295.0, col: 7,  row: 7 },
  { iso2: "IT", country: "Italy",           median: 146.0, mean: 318.0, col: 9,  row: 7 },
  { iso2: "GR", country: "Greece",          median:  66.0, mean: 159.0, col: 11, row: 10 },
  { iso2: "CY", country: "Cyprus",          median: 209.4, mean: 451.0, col: 12, row: 9 },
  { iso2: "MT", country: "Malta",           median: 261.0, mean: 459.0, col: 9,  row: 8 },

  // ── Central Europe ─────────────────────────────────────
  { iso2: "PL", country: "Poland",          median:  75.0, mean: 140.0, col: 10, row: 2 },
  { iso2: "CZ", country: "Czechia",         median:  94.0, mean: 169.0, col: 10, row: 3 },
  { iso2: "SK", country: "Slovakia",        median:  75.0, mean: 131.0, col: 10, row: 5 },
  { iso2: "HU", country: "Hungary",         median:  47.0, mean:  88.0, col: 10, row: 6 },
  { iso2: "HR", country: "Croatia",         median:  69.0, mean: 130.0, col: 10, row: 7 },
  { iso2: "SI", country: "Slovenia",        median: 133.0, mean: 213.0, col: 9,  row: 6 },

  // ── Eastern Europe ─────────────────────────────────────
  { iso2: "EE", country: "Estonia",         median:  88.0, mean: 167.0, col: 11, row: 2 },
  { iso2: "LV", country: "Latvia",          median:  31.0, mean:  73.0, col: 11, row: 3 },
  { iso2: "LT", country: "Lithuania",       median:  54.0, mean: 104.0, col: 11, row: 4 },
  { iso2: "RO", country: "Romania",         median:  45.0, mean:  98.0, col: 11, row: 6 },
  { iso2: "BG", country: "Bulgaria",        median:  39.0, mean:  78.0, col: 11, row: 8 },
];