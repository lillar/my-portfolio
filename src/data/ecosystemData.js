// Environmental cost of building this chart with Claude
//
// Token cost estimates (Claude Sonnet 4):
//   Electricity: ~0.001 kWh per 1,000 tokens
//   Water:       ~1.0 ml per 1,000 tokens (data centre cooling)
//   Carbon:      ~0.4g CO₂ per 1,000 tokens (EU grid average)
//
// tokens = rough estimate of input + output tokens per iteration
// satisfaction = 1–10 score (1=far from goal, 10=done)

export const iterations = [
  {
    n: 1,
    label: "Topic + concept",
    desc: "Proposed relationship/ecosystem topic, defined cost metrics",
    tokens: 800,
    satisfaction: 4,
  },
  {
    n: 2,
    label: "Cost definition",
    desc: "Agreed on electricity, water, carbon as the three environmental cost metrics",
    tokens: 600,
    satisfaction: 9,
  },
  {
    n: 3,
    label: "Data file",
    desc: "Created ecosystemData.js with placeholder iterations array",
    tokens: 1200,
    satisfaction: 9,
  },
  {
    n: 4,
    label: "Chart build",
    desc: "Built EcosystemChart.jsx — connected dot plot, quality zones, pending dots",
    tokens: 2800,
    satisfaction: 6,
  },
  {
    n: 5,
    label: "Code review",
    desc: "Renamed accuracy→satisfaction, cleaned stale comments, fixed color naming, resolved label overlap",
    tokens: 1400,
    satisfaction: 7,
  },
  {
    n: 6,
    label: "UI polish",
    desc: "Container fill, bigger text, nested size legend, hover+click info panel, removed inline labels",
    tokens: 2200,
    satisfaction: 9,
  },
  {
    n: 7,
    label: "Alignment fixes",
    desc: "Repositioned legend to avoid axis overlap, restructured info panel layout, manual alignment tweaks were needed",
    tokens: 1600,
    satisfaction: 7,
  },
  {
    n: 8,
    label: "Title and description",
    desc: "Wrote title, description with running environmental totals, source with methodology notes, and a personal reflection",
    tokens: 700,
    satisfaction: 10,
  },
];

// Derive environmental metrics from token count
export function envCost(tokens) {
  return {
    kwh:    +(tokens / 1000 * 0.001).toFixed(4),   // electricity kWh
    water:  +(tokens / 1000 * 1.0).toFixed(2),     // ml water
    carbon: +(tokens / 1000 * 0.4).toFixed(3),     // g CO₂
  };
}

// Cumulative cost up to iteration n
export function cumulativeCost(upToN) {
  return iterations
    .filter(i => i.n <= upToN)
    .reduce((acc, i) => {
      const c = envCost(i.tokens);
      return {
        kwh:    +(acc.kwh    + c.kwh).toFixed(4),
        water:  +(acc.water  + c.water).toFixed(2),
        carbon: +(acc.carbon + c.carbon).toFixed(3),
      };
    }, { kwh: 0, water: 0, carbon: 0 });
}