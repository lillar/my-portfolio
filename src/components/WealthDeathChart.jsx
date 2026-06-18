import { useMemo } from "react";
import * as d3 from "d3";

// ── Layout ────────────────────────────────────────────────────────────────────
const VW = 500, VH = 500;
const CX = 250, CY = 218;
const INNER_R = 100;
const RING_W  = 22;
const N_RINGS = 5;
const OUTER_R = INNER_R + N_RINGS * RING_W;  // 187
const LABEL_R = OUTER_R + 10;                // 203
// 11 segments: 10 countries + 1 legend wedge between SGP (ci=4) and MOZ (ci=6)
const N        = 11;
const LEGEND_CI = 5;
const GAP      = 0.018;

// ── Country data ──────────────────────────────────────────────────────────────
// ci = the actual angular slot (0–4 rich, 5 = legend, 6–10 poor)
// Source: WHO GHE 2021 "All ages", leaf-level causes; World Bank GDP/cap 2021
const COUNTRIES = [
  { ci: 0,  id: "lux", label: "LUX", causes: ["Ischaemic heart disease","COVID-19","Alzheimer disease and other dementias","Other circulatory diseases","Chronic obstructive pulmonary disease"] },
  { ci: 1,  id: "irl", label: "IRL", causes: ["Ischaemic heart disease","COVID-19","Alzheimer disease and other dementias","Chronic obstructive pulmonary disease","Trachea, bronchus, lung cancers"] },
  { ci: 2,  id: "che", label: "CHE", causes: ["Ischaemic heart disease","Alzheimer disease and other dementias","COVID-19","Trachea, bronchus, lung cancers","Other circulatory diseases"] },
  { ci: 3,  id: "nor", label: "NOR", causes: ["Ischaemic heart disease","Alzheimer disease and other dementias","Chronic obstructive pulmonary disease","Trachea, bronchus, lung cancers","Other circulatory diseases"] },
  { ci: 4,  id: "sgp", label: "SGP", causes: ["Ischaemic heart disease","Lower respiratory infections","Trachea, bronchus, lung cancers","Colon and rectum cancers","Hypertensive heart disease"] },
  // ci: 5 → legend wedge (rendered separately)
  { ci: 6,  id: "moz", label: "MOZ", causes: ["HIV/AIDS","COVID-19","Malaria","Haemorrhagic stroke","Preterm birth complications"] },
  { ci: 7,  id: "caf", label: "CAF", causes: ["Tuberculosis","Lower respiratory infections","Malaria","HIV/AIDS","Diarrhoeal diseases"] },
  { ci: 8,  id: "mdg", label: "MDG", causes: ["Lower respiratory infections","Haemorrhagic stroke","Diarrhoeal diseases","Tuberculosis","Malaria"] },
  { ci: 9,  id: "afg", label: "AFG", causes: ["Collective violence and legal intervention","Ischaemic heart disease","COVID-19","Preterm birth complications","Measles"] },
  { ci: 10, id: "bdi", label: "BDI", causes: ["Lower respiratory infections","Malaria","Diarrhoeal diseases","Preterm birth complications","Haemorrhagic stroke"] },
];

// Legend wedge ring labels (innermost → outermost)
const RING_LABELS = [
  { label: "Main cause", fs: 6},
  { label: "2nd",        fs: 6   },
  { label: "3rd",        fs: 6   },
  { label: "4th",        fs: 6   },
  { label: "5th",        fs: 6   },
];

const ABBR = {
  "Malaria":                                        "MAL",
  "COVID-19":                                       "COVID",
  "Haemorrhagic stroke":                            "H-STR",
  "Ischaemic heart disease":                        "IHD",
  "Lower respiratory infections":                   "LRI",
  "Trachea, bronchus, lung cancers":                "LUNG",
  "Alzheimer disease and other dementias":          "DEM",
  "Chronic obstructive pulmonary disease":          "COPD",
  "Collective violence and legal intervention":     "WAR",
  "Measles":                                        "MSL",
  "HIV/AIDS":                                       "HIV",
  "Tuberculosis":                                   "TB",
  "Diarrhoeal diseases":                            "DIAR",
  "Colon and rectum cancers":                       "CRC",
  "Hypertensive heart disease":                     "HHD",
  "Other circulatory diseases":                     "CIRC",
  "Preterm birth complications":                    "PTB",

};

const LEGEND_CAUSES = Object.keys(ABBR);

// ── Visual ────────────────────────────────────────────────────────────────────

const CAUSE_COLORS = {
  "Ischaemic heart disease": "#b904ca",
  "Lower respiratory infections": "#15bc9d",
  "COVID-19": "#5800FF",
  "Trachea, bronchus, lung cancers": "#f97316",
  "Malaria": "#ffc600",
};

const DEFAULT_FILL = "#fafafa";

const LEGEND_FILL  = "#f3f3f3";

const CELL_TEXT    = "#444";
const CELL_STROKE  = "#ffffff";

const arcGen = d3.arc();

function segAngles(ci) {
  return {
    sa: (ci / N) * 2 * Math.PI + GAP / 2,
    ea: ((ci + 1) / N) * 2 * Math.PI - GAP / 2,
    mid: (ci + 0.5) / N * 2 * Math.PI,
  };
}

function textRotation(midAngle) {
  const baseDeg = midAngle * 180 / Math.PI;
  const flip = midAngle >= Math.PI / 2 && midAngle < 3 * Math.PI / 2;
  return flip ? baseDeg + 180 : baseDeg;
}

function buildCells() {
  const cells = [];
  COUNTRIES.forEach((country) => {
    const { sa, ea, mid } = segAngles(country.ci);
    country.causes.forEach((cause, ki) => {
      const ir = INNER_R + ki * RING_W;
      const or = INNER_R + (ki + 1) * RING_W;
      const midR = INNER_R + (ki + 0.5) * RING_W;
cells.push({
  key: `${country.id}-${ki}`,
  arcD: arcGen({
    innerRadius: ir,
    outerRadius: or,
    startAngle: sa,
    endAngle: ea
  }),
  fill: CAUSE_COLORS[cause] ?? DEFAULT_FILL,
  textFill: CAUSE_COLORS[cause] ? "#ffffff" : "#444",
  abbr: ABBR[cause] ?? cause.slice(0, 5).toUpperCase(),
  tx: midR * Math.sin(mid),
  ty: -midR * Math.cos(mid),
  rot: textRotation(mid),
});
    });
  });
  return cells;
}

function buildLegendCells() {
  const { sa, ea, mid } = segAngles(LEGEND_CI);  // mid = π → bottom
  return RING_LABELS.map(({ label, fs }, ki) => {
    const ir = INNER_R + ki * RING_W;
    const or = INNER_R + (ki + 1) * RING_W;
    const midR = INNER_R + (ki + 0.5) * RING_W;
    return {
      key: `legend-${ki}`,
      arcD: arcGen({ innerRadius: ir, outerRadius: or, startAngle: sa, endAngle: ea }),
      label, fs,
      tx: midR * Math.sin(mid),   // ≈ 0 (bottom segment is symmetric)
      ty: -midR * Math.cos(mid),  // = midR (below centre)
      rot: textRotation(mid),     // = 0° (horizontal)
    };
  });
}

const ARC_RICH = "M 254.8 126.1 A 92 92 0 0 1 338.9 194.2";
// CW arc from θ=3° to θ=75°, starts just right of separator, curves down to right side

const ARC_POOR = "M 161.1 194.2 A 92 92 0 0 1 245.2 126.1";
// CW arc from θ=285° to θ=357°, starts at left side, curves up to just left of separator


// ── Component ─────────────────────────────────────────────────────────────────
export default function WealthDeathChart() {
  const cells       = useMemo(() => buildCells(), []);
  const legendCells = useMemo(() => buildLegendCells(), []);

  const countryLabels = COUNTRIES.map((c) => {
    const mid = (c.ci + 0.5) / N * 2 * Math.PI;

    return {
      ...c,
      x: CX + LABEL_R * Math.sin(mid),
      y: CY - LABEL_R * Math.cos(mid),
      rot: textRotation(mid)
    };
  });

  const LEG_Y0  = 464;
  const LEG_DY  = 10;
  const LEG_COL = [14, 182, 350];
  const PER_COL = 6;

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Disease arc cells ── */}
        <g transform={`translate(${CX}, ${CY})`}>
          {cells.map(c => (
            <g key={c.key}>
              <path d={c.arcD} fill={c.fill} stroke={"#d9d9d9"} strokeWidth={0.5} />
              <text x={c.tx} y={c.ty}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={6} fontWeight={700}
                fontFamily="var(--mono)" fill={c.textFill}
                transform={`rotate(${c.rot}, ${c.tx}, ${c.ty})`}>
                {c.abbr}
              </text>
            </g>
          ))}

          {/* ── Legend wedge (ci = 5, centred at 180° / 6 o'clock) ── */}
          {legendCells.map(c => (
            <g key={c.key}>
              <path d={c.arcD} fill={LEGEND_FILL} stroke={CELL_STROKE} strokeWidth={0.8} />
              <text x={c.tx} y={c.ty}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={c.fs} fontStyle="italic"
                fontFamily="var(--mono)" fill="var(--text-muted, #888)"
                transform={`rotate(${c.rot}, ${c.tx}, ${c.ty})`}>
                {c.label}
              </text>
            </g>
          ))}
        </g>

        {/* ── Ring divider circles ── */}
        {d3.range(N_RINGS + 1).map(i => (
          <circle key={i} cx={CX} cy={CY} r={INNER_R + i * RING_W}
            fill="none" stroke={CELL_STROKE} strokeWidth={0.6} />
        ))}

        {/* ── Segment divider lines (all 11 slots) ── */}
        {d3.range(N).map(i => {
          const a = (i / N) * 2 * Math.PI;
          return (
            <line key={i}
              x1={CX + INNER_R * Math.sin(a)} y1={CY - INNER_R * Math.cos(a)}
              x2={CX + OUTER_R * Math.sin(a)} y2={CY - OUTER_R * Math.cos(a)}
              stroke={CELL_STROKE} strokeWidth={1} />
          );
        })}

        {/* ── Separator: rich (right, ci 0-4) vs poor (left, ci 6-10) ── */}
        {/* Stops at the bottom of the inner hole — does not cut through legend wedge */}
        <line
          x1={CX} y1={CY - OUTER_R - 14}
          x2={CX} y2={CY - INNER_R + 4}
          stroke="var(--text, #111)" strokeWidth={1.2}
        />

        {/* ── Country labels ── */}
        {countryLabels.map(c => (
          <text
            key={c.id}
            x={c.x}
            y={c.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fontWeight={700}
            letterSpacing="1px"
            fill="#222"
            transform={`rotate(${c.rot}, ${c.x}, ${c.y})`}
          >
            {c.label}
          </text>
        ))}

        {/* ── Centre hole ── */}
        <circle cx={CX} cy={CY} r={INNER_R - 1} fill="var(--surface, #fff)" />

        {/* ── Rich / poor annotation ── */}
        <defs>
          <path id="arc-rich" d={ARC_RICH} />
          <path id="arc-poor" d={ARC_POOR} />
        </defs>

        <text fontSize={6} fontFamily="var(--mono)" fill="var(--text-muted, #888)" >
          <textPath href="#arc-rich" startOffset="0%" textAnchor="start">
          |———— the 5 richest countries
          </textPath>
        </text>

        <text fontSize={6} fontFamily="var(--mono)" fill="var(--text-muted, #888)">
          <textPath href="#arc-poor" startOffset="100%" textAnchor="end">
            the 5 poorest countries ————|
          </textPath>
        </text>

{/* ── Centre title ── */}

<text
  x={CX}
  y={CY - 18}
  textAnchor="middle"
  fontSize={26}
  fontFamily="Georgia"
  fill="#111"
>
  What kills us
</text>

<text
  x={CX}
  y={CY + 6}
  textAnchor="middle"
  fontSize={8}
  fill="#666"
>
  Top 5 causes of death
</text>

<text
  x={CX}
  y={CY + 18}
  textAnchor="middle"
  fontSize={8}
  fill="#666"
>
  richest vs poorest countries
</text>

<text
  x={CX}
  y={CY + 30}
  textAnchor="middle"
  fontSize={8}
  fill="#666"
>
  GDP per capita · 2021
</text>

{/* ── Colour legend ── */}

{[
  ["IHD", "#b904ca"],
  ["COVID", "#5800FF"],
  ["MAL", "#ffc600"],
  ["LRI", "#15bc9d"],
  ["LUNG", "#f97316"],

].map(([label, colour], i) => (
  <g key={label}>
    <rect
      x={CX - 64 + i * 28}
      y={CY + 45}
      width={6}
      height={6}
      fill={colour}
      stroke="#ccc"
    />
    <text
      x={CX - 55 + i * 28}
      y={CY + 50}
      fontSize={5}
      fill="#555"
    >
      {label}
    </text>
  </g>
))}

{/* ── Meaning of abbreviations ── */}

<text
  x={0}
  y={VH-100}
  fontSize={8}
  fontWeight={700}
>
  Abbreviations
</text>

{LEGEND_CAUSES.slice(0, 9).map((cause, i) => (
  <text
    key={`left-${cause}`}
    x={0}
    y={VH-85 + i * 12}
    fontSize={6.5}
    textAnchor="start"
  >
    <tspan fontWeight={700}>{ABBR[cause]}</tspan>
    <tspan fill="#666"> {cause}</tspan>
  </text>
))}

{LEGEND_CAUSES.slice(9).map((cause, i) => (
  <text
    key={`right-${cause}`}
    x={VW}
    y={VH-75 + i * 12}
    fontSize={6.5}
    textAnchor="end"
  >
    <tspan fill="#666">{cause} </tspan>
    <tspan fontWeight={700}>{ABBR[cause]}</tspan>
  </text>
))}

      </svg>
    </div>
  );
}
