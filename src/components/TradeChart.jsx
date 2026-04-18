import { useState } from "react";
import * as d3 from "d3";
import { categories, groups } from "../data/tradeData";

const COLOR_DOMESTIC = "#F67D31";  // orange
const COLOR_IMPORT   = null;       // category color (dynamic)
const COLOR_EXPORT   = "#aaaaaa";  // grey

// ── Exclude dairy + drinks from rose ─────────────────────
const ANNOTATED = ["dairy", "drinks"];
const roseCategories = categories.filter(c => !ANNOTATED.includes(c.id));
const annotated      = categories.filter(c => ANNOTATED.includes(c.id));

// ── Display amount helper ─────────────────────────────────
function displayAmount(c) {
  if (c.frequency === "daily") {
    const daily = Math.round(c.weeklyG / 7);
    return `${daily}${c.unit}/day`;
  }
  return `${c.weeklyG}${c.unit}/week`;
}

// ── Layout ────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;
const CX     = 250;
const CY     = 225;
const R_MAX  = 185;
const R_MIN  = 20;
const PAD_RAD = (1.5 * Math.PI) / 180;

// ── Scales ────────────────────────────────────────────────
const N    = roseCategories.length;
const SPAN = (2 * Math.PI) / N;

const maxG = d3.max(roseCategories, c => c.weeklyG);
const sqrtScale = d3.scaleSqrt()
  .domain([0, maxG])
  .range([0, R_MAX]);

const radius = g => Math.max(sqrtScale(g), R_MIN);

// ── Arc data ──────────────────────────────────────────────
const arcData = roseCategories.map((c, i) => {
  const startAngle = -Math.PI / 2 + i * SPAN;
  const endAngle   = startAngle + SPAN - PAD_RAD;
  const midAngle   = startAngle + (SPAN - PAD_RAD) / 2;
  const r          = radius(c.weeklyG);
  return { ...c, startAngle, endAngle, midAngle, r };
});

// ── Arc generators ────────────────────────────────────────
const arcMain = d3.arc()
  .innerRadius(0).outerRadius(d => d.r)
  .startAngle(d => d.startAngle).endAngle(d => d.endAngle)
  .cornerRadius(2);

const arcDom = d3.arc()
  .innerRadius(0).outerRadius(d => d.r * d.domesticPct / 100)
  .startAngle(d => d.startAngle).endAngle(d => d.endAngle)
  .cornerRadius(2);

const arcImp = d3.arc()
  .innerRadius(d => d.r * d.domesticPct / 100)
  .outerRadius(d => d.r * (d.domesticPct + d.importPct) / 100)
  .startAngle(d => d.startAngle).endAngle(d => d.endAngle)
  .cornerRadius(2);

// ── Annotation card ───────────────────────────────────────
function AnnotationCard({ c, x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-80} y={-22} width={160} height={44}
        rx={6} fill="var(--bg-card)"
        stroke={c.groupColor} strokeWidth={1} />
      <circle cx={-66} cy={-8} r={5} fill={c.groupColor} />
      <text x={-57} y={-8}
        dominantBaseline="middle" fontSize={9.5}
        fontFamily="var(--mono)" fontWeight={700}
        fill="var(--text)">
        {c.label}
      </text>
      <text x={0} y={10}
        textAnchor="middle" fontSize={8}
        fontFamily="var(--mono)" fill="var(--text-muted)">
        {displayAmount(c)} · {c.domesticPct}% NL
      </text>
    </g>
  );
}

// ── Legend items ──────────────────────────────────────────
const legendItems = [
  { label: "Vegetables & fruit", color: "#4caf50" },
  { label: "Grains & potatoes",  color: "#85631e" },
  { label: "Protein & dairy",    color: "#b904ca" },
  { label: "Fats & oils",        color: "#ffc600" },
  { label: "Drinks",             color: "#64b5f6" },
];

// Compute x positions: fixed GAP between items, whole group centered
// Each item = 10px dot + 4px gap + text. Estimate text width at 6px/char.
const LEGEND_GAP = 8;
const itemWidths = legendItems.map(l => 10 + 2 + l.label.length * 6.0);
const totalLegendW = itemWidths.reduce((s, w) => s + w, 0) + LEGEND_GAP * (legendItems.length - 1);

// Build cumulative x positions (centered)
const legendXs = [];
let xCursor = CX - totalLegendW / 2;
legendItems.forEach((l, i) => {
  legendXs.push(xCursor);
  xCursor += itemWidths[i] + LEGEND_GAP;
});

export default function TradeChart() {
  const [hovered, setHovered] = useState(null);
  const hovData = hovered ? arcData.find(a => a.id === hovered) : null;

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Legend: horizontal, equal gap, centered ── */}
        <g transform="translate(0, 10)">
          {legendItems.map((l, i) => (
            <g key={l.label} transform={`translate(${legendXs[i]}, 0)`}>
              <circle cx={5} cy={6} r={5} fill={l.color} />
              <text x={14} y={6}
                dominantBaseline="middle"
                fontSize={7.5} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {l.label}
              </text>
            </g>
          ))}
        </g>

        {/* ── Rose chart ── */}
        {arcData.map(d => {
          const isHov  = hovered === d.id;
          const dimmed = hovered !== null && !isHov;

          return (
            <g key={d.id}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>

              {/* Normal arc */}
              {!isHov && (
                <path d={arcMain(d)}
                  transform={`translate(${CX},${CY})`}
                  fill={d.groupColor}
                  fillOpacity={dimmed ? 0.1 : 0.82}
                  stroke="var(--bg)" strokeWidth={1.5} />
              )}

              {/* Hover: domestic + import split */}
              {isHov && (
                <>
                  <path d={arcDom(d)}
                    transform={`translate(${CX},${CY})`}
                    fill={COLOR_DOMESTIC} fillOpacity={0.92}
                    stroke="var(--bg)" strokeWidth={1.5} />
                  <path d={arcImp(d)}
                    transform={`translate(${CX},${CY})`}
                    fill={d.groupColor} fillOpacity={0.92}
                    stroke="var(--bg)" strokeWidth={1.5} />
                </>
              )}

            </g>
          );
        })}

        {/* ── Annotations: Drinks + Dairy — bottom center ── */}
        <AnnotationCard
          c={annotated.find(c => c.id === "drinks")}
          x={145} y={458}
        />
        <AnnotationCard
          c={annotated.find(c => c.id === "dairy")}
          x={355} y={458}
        />

        {/* ── Hover info panel — bottom center ── */}
        {hovData && (
          <g transform={`translate(${CX}, ${VH - 140})`}>
            <rect x={-200} y={-20} width={430} height={60}
              rx={6} fill="var(--bg)"
              stroke="var(--border)" strokeWidth={1} />

            <text x={0} y={-6}
              textAnchor="middle" fontSize={11}
              fontFamily="var(--mono)" fontWeight={700}
              fill="var(--text)">
              {hovData.label}
            </text>
            <text x={0} y={8}
              textAnchor="middle" fontSize={8}
              fontFamily="var(--mono)" fill="var(--text-muted)">
              {displayAmount(hovData)}
            </text>

            {/* Three pills: domestic, import, export */}
            {[
              { label: `${hovData.domesticPct}% domestic`, color: COLOR_DOMESTIC },
              { label: `${hovData.importPct}% imported`,   color: hovData.groupColor },
              { label: `exports ${(hovData.exportPct / 100).toFixed(1)}× domestic use`,   color: COLOR_EXPORT },
            ].map(({ label, color }, i) => (
              <g key={i} transform={`translate(${(i - 1) * 140}, 22)`}>
                <rect x={-56} y={-8} width={140} height={16}
                  rx={3} fill={color} fillOpacity={0.15} />
                <circle cx={-46} cy={0} r={4} fill={color} />
                <text x={-38} y={0}
                  dominantBaseline="middle" fontSize={8}
                  fontFamily="var(--mono)" fill="var(--text)">
                  {label}
                </text>
              </g>
            ))}
          </g>
        )}

      </svg>
    </div>
  );
}