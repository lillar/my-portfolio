// Source: CBS Statistics Netherlands, EBN Energy Infographic 2023
// IEA Netherlands Energy Policy Review 2024
// All values in PJ (petajoules), 2023
// Primary energy supply → final consumption by sector

// ── Nodes ─────────────────────────────────────────────────
// Sources (left), conversion (middle), uses (right)
export const nodes = [
  // Sources
  { id: "gas",      label: "Natural Gas", group: "source",  color: "#1a171a" },
  { id: "oil",      label: "Oil",         group: "source",  color: "#1a171a" },
  { id: "coal",     label: "Coal",        group: "source",  color: "#1a171a" },
  { id: "wind",     label: "Wind",        group: "source",  color: "#15bc9d" },
  { id: "solar",    label: "Solar",       group: "source",  color: "#15bc9d" },
  { id: "biomass",  label: "Biomass",     group: "source",  color: "#15bc9d" },
  { id: "nuclear",  label: "Nuclear",     group: "source",  color: "#5800FF" },

  // Uses
  { id: "industry",    label: "Industry",    group: "use", color: "#1a171a" },
  { id: "transport",   label: "Transport",   group: "use", color: "#1a171a" },
  { id: "households",  label: "Households",  group: "use", color: "#1a171a" },
  { id: "export",      label: "Export",      group: "use", color: "#1a171a" },
  { id: "losses",      label: "Losses &\nTransform.", group: "use", color: "#888" },
];

// ── Links (flows) ──────────────────────────────────────────
// value in PJ
export const links = [
  // Natural Gas → uses
  { source: "gas",     target: "industry",   value: 480 },
  { source: "gas",     target: "households", value: 280 },
  { source: "gas",     target: "losses",     value: 320 },
  { source: "gas",     target: "export",     value: 176 },

  // Oil → uses (mostly transport + industry feedstock)
  { source: "oil",     target: "transport",  value: 580 },
  { source: "oil",     target: "industry",   value: 380 },
  { source: "oil",     target: "export",     value: 142 },

  // Coal → industry + losses
  { source: "coal",    target: "industry",   value: 120 },
  { source: "coal",    target: "losses",     value: 115 },

  // Wind → households + export
  { source: "wind",    target: "households", value: 76  },
  { source: "wind",    target: "export",     value: 57  },

  // Solar → households + industry
  { source: "solar",   target: "households", value: 50  },
  { source: "solar",   target: "industry",   value: 26  },

  // Biomass → industry + losses
  { source: "biomass", target: "industry",   value: 55  },
  { source: "biomass", target: "losses",     value: 35  },

  // Nuclear → households + export
  { source: "nuclear", target: "households", value: 24  },
  { source: "nuclear", target: "export",     value: 13  },
];