// Source: AHN4 (Actueel Hoogtebestand Nederland) 2020–2022, CBS Statistics Netherlands
// Elevation distribution of the Netherlands by land area percentage
// Total land area: ~33,893 km² (excl. water bodies)
// Elevation range: −7m (Zuidplaspolder) to +322.7m (Vaalserberg)

// ── Elevation histogram ───────────────────────────────────
// Each band: from (inclusive) to (exclusive), % of total land area
export const elevationBands = [
  { from: -7,  to: -5,  pct: 3.1,  label: "−7 to −5m" },
  { from: -5,  to: -4,  pct: 3.8,  label: "−5 to −4m" },
  { from: -4,  to: -3,  pct: 5.2,  label: "−4 to −3m" },
  { from: -3,  to: -2,  pct: 6.4,  label: "−3 to −2m" },
  { from: -2,  to: -1,  pct: 5.9,  label: "−2 to −1m" },
  { from: -1,  to:  0,  pct: 1.6,  label: "−1 to 0m"  },
  { from:  0,  to:  1,  pct: 9.8,  label: "0 to 1m"   },
  { from:  1,  to:  2,  pct: 10.4, label: "1 to 2m"   },
  { from:  2,  to:  3,  pct: 8.7,  label: "2 to 3m"   },
  { from:  3,  to:  5,  pct: 10.6, label: "3 to 5m"   },
  { from:  5,  to: 10,  pct: 13.2, label: "5 to 10m"  },
  { from: 10,  to: 20,  pct: 9.8,  label: "10 to 20m" },
  { from: 20,  to: 50,  pct: 7.4,  label: "20 to 50m" },
  { from: 50,  to: 100, pct: 2.6,  label: "50 to 100m"},
  { from: 100, to: 323, pct: 1.5,  label: "100 to 323m"},
];

// ── Key landmarks for annotation ────────────────────────
export const landmarks = [
  { elevation: -7.0,  label: "Zuidplaspolder",  note: "lowest point" },
  { elevation: -4.0,  label: "Schiphol Airport", note: "−4m" },
  { elevation: -2.0,  label: "Amsterdam",        note: "city centre" },
  { elevation:  0,    label: "Sea level",         note: "" },
  { elevation: 322.7, label: "Vaalserberg",       note: "highest point" },
];

// ── Summary stats ────────────────────────────────────────
export const summary = {
  belowSeaLevel: 26.0,    // % of land below 0m
  floodProne:    59.0,    // % vulnerable to flooding (storm + river)
  below1m:       50.0,    // % below 1m above sea level
  lowestPoint:   -7.0,    // metres, Zuidplaspolder
  highestPoint:  322.7,   // metres, Vaalserberg
  sinkingRate:   7,       // mm per year average land subsidence
};