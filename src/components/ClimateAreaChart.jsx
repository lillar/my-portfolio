import { useState, useMemo } from "react";
import * as d3 from "d3";
import { climateData } from "../data/climateData";

const CHAPTERS = [
  {
    id: 0, label: "All", years: null,
    title: "A century of warming",
    annotation: "Each ring is a decade from 1880 to 2020. Anomalies are measured against the 1951–1980 NASA baseline — so 0°C means average for that period.",
  },
  {
    id: 1, label: "1880–1920", years: [1880, 1890, 1900, 1910, 1920],
    title: "Pre-industrial baseline",
    annotation: "Most anomalies sit below 0°C. The climate is relatively stable. Fossil fuel use is minimal and warming signals are absent.",
  },
  {
    id: 2, label: "1930–1960", years: [1930, 1940, 1950, 1960],
    title: "Early industrialization",
    annotation: "The coal and oil boom begins. Anomalies start creeping above zero — the first fingerprint of human influence on the climate.",
  },
  {
    id: 3, label: "1970–1990", years: [1970, 1980, 1990],
    title: "The alarm is raised",
    annotation: "Every decade sits firmly above the baseline. Scientists publish the first major warnings. The 1980s are the hottest decade on record — until the next one.",
  },
  {
    id: 4, label: "2000–2020", years: [2000, 2010, 2020],
    title: "No going back",
    annotation: "2020 reached +1.02°C above the baseline — and 2024 surpassed +1.4°C. The Paris Agreement target of 1.5°C is now within reach of every passing year.",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const colorScale = d3.scaleSequential()
  .domain([1880, 2020])
  .interpolator(d3.interpolateRgbBasis(["#15bc9d", "#5800FF", "#ffc600", "#b904ca"]));

// ── Dimensions ─────────────────────────────────────────────
const width = 600;
const height = 450;
const margin = { top: 80, right: 50, bottom: 40, left: 52 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Absolute cartesian origin
const ox = margin.left;
const oy = margin.top;

// Radial center
const rcx = width / 2;
const rcy = oy + innerHeight / 2 + 10;

// Ring layout:
// 1880 = outermost ring, 2020 = innermost ring
// Each ring has a base radius + anomaly modulation
const N_YEARS = climateData.length; // 15 decades
const R_MAX = Math.min(innerWidth, innerHeight) / 2 - 8;  // outermost ring outer edge
const R_MIN = 28;                                          // innermost ring inner edge
const RING_WIDTH = (R_MAX - R_MIN) / N_YEARS;             // width allocated per ring
const ANOMALY_SCALE = RING_WIDTH * 0.55;                   // how much anomaly modulates radius

// ── Path builders ──────────────────────────────────────────

function buildCartesianArea(months, xScale, yScale) {
  return d3.area()
    .x((_, i) => ox + xScale(MONTHS[i]))
    .y0(oy + yScale(0))
    .y1((d) => oy + (d !== null ? yScale(d) : yScale(0)))
    .defined((d) => d !== null)
    .curve(d3.curveMonotoneX)(months);
}

// Ring-shaped blob:
// - yearIdx 0 = 1880 (outermost), yearIdx N-1 = 2020 (innermost)
// - base radius = R_MAX - yearIdx * RING_WIDTH
// - outer edge = base + anomaly * ANOMALY_SCALE
// - inner edge = base - RING_WIDTH * 0.5 (constant inner boundary)
// Result: a closed annular shape that varies by month anomaly
function buildRingBlob(months, yearIdx) {
  const STEPS = 180;
  const n = months.length;
  const baseR = R_MAX - yearIdx * RING_WIDTH;

  const vals = months.filter((v) => v !== null);
  const minV = d3.min(vals);
  const maxV = d3.max(vals);
  const range = Math.max(maxV - minV, 0.01);

  const outerPts = [];

  // s < STEPS (not <=) so we never duplicate the start point
  for (let s = 0; s < STEPS; s++) {
    const t = s / STEPS;
    const i = Math.min(Math.floor(t * n), n - 1);
    const frac = t * n - Math.floor(t * n);
    const v0 = months[i] ?? 0;
    const v1 = months[(i + 1) % n] ?? 0;
    const val = v0 + (v1 - v0) * frac;
    const norm = (val - minV) / range;
    const outerR = baseR + (norm - 0.5) * ANOMALY_SCALE * 2;
    const angle = t * 2 * Math.PI - Math.PI / 2;
    outerPts.push([
      rcx + outerR * Math.cos(angle),
      rcy + outerR * Math.sin(angle),
    ]);
  }

  return (
    "M " +
    outerPts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ") +
    " Z"
  );
}

export default function ClimateAreaChart() {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [isRadial, setIsRadial] = useState(false);

  const allValues = climateData.flatMap((d) => d.months.filter((v) => v !== null));
  const absMax = Math.max(Math.abs(d3.min(allValues)), Math.abs(d3.max(allValues)));
  const yMax = Math.ceil(absMax * 10) / 10;

  const yScale = useMemo(() =>
    d3.scaleLinear().domain([-yMax, yMax]).range([innerHeight, 0]).nice(),
  [yMax]);

  const xScale = d3.scalePoint()
    .domain(MONTHS).range([0, innerWidth]).padding(0.2);

  const chapter = CHAPTERS[chapterIdx];
  const activeYears = chapter.years;
  const isActive = (year) => activeYears === null || activeYears.includes(year);
  const yTicks = yScale.ticks(6);

  // Staggered year labels — cartesian only
  const activeData = climateData.filter((d) => isActive(d.year) && activeYears !== null);
  const sortedByDec = [...activeData].sort(
    (a, b) => (b.months[11] ?? b.months[10]) - (a.months[11] ?? a.months[10])
  );
  const labelPositions = {};
  let lastY = -Infinity;
  sortedByDec.forEach((d) => {
    const rawY = yScale(d.months[11] ?? d.months[10]);
    const y = Math.max(rawY, lastY + 12);
    labelPositions[d.year] = y;
    lastY = y;
  });

  // Pre-compute ring paths — expensive, memoize
  const ringPaths = useMemo(() =>
    climateData.map((d, i) => ({
      year: d.year,
      // reverse: i=0 (1880) → yearIdx = N-1 (innermost), i=N-1 (2020) → yearIdx = 0 (outermost)
      path: buildRingBlob(d.months, N_YEARS -1 - i),
    })),
  []);

  // Cartesian paths
  const cartesianPaths = useMemo(() =>
    climateData.map((d) => ({
      year: d.year,
      path: buildCartesianArea(d.months, xScale, yScale),
    })),
  [yScale, xScale]);

  // Render order:
  // Linear: reverse so 2020 is bottom, 1880 is top
  // Radial: normal order so 1880 (outer) is bottom, 2020 (inner) is top
  const renderData = [...climateData].reverse();

  return (
    <div style={{ width: "100%", fontFamily: "var(--mono)" }}>

      {/* Chapter buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
        {CHAPTERS.map((c, i) => (
          <button key={c.id} onClick={() => setChapterIdx(i)} style={{
            fontFamily: "var(--mono)", fontSize: 11, padding: "4px 10px",
            border: "1px solid var(--border)", borderRadius: 3,
            background: i === chapterIdx ? "var(--text)" : "transparent",
            color: i === chapterIdx ? "var(--bg)" : "var(--text-muted)",
            cursor: "pointer",
          }}>{c.label}</button>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">

        {/* Title + annotation */}
        <text x={margin.left} y={16} fontSize={14} fontWeight={600} fill="var(--text)">
          {chapter.title}
        </text>
        <foreignObject x={margin.left} y={28} width={innerWidth} height={50}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{
            fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "var(--mono)",
          }}>
            {chapter.annotation}
          </div>
        </foreignObject>

        {/* ── Cartesian axes — fade out in radial mode ── */}
        <g opacity={isRadial ? 0 : 1}
          style={{ transition: "opacity 0.6s ease" }}
          pointerEvents={isRadial ? "none" : "auto"}>
          <g transform={`translate(${ox}, ${oy})`}>
            {yTicks.map((tick) => (
              <g key={tick}>
                <line x1={0} x2={innerWidth} y1={yScale(tick)} y2={yScale(tick)}
                  stroke="var(--border)" strokeWidth={0.5}
                  strokeDasharray={tick === 0 ? "none" : "3 3"} />
                <text x={-8} y={yScale(tick)} textAnchor="end"
                  dominantBaseline="middle" fontSize={10} fill="var(--text-muted)">
                  {tick > 0 ? `+${tick.toFixed(1)}` : tick.toFixed(1)}°C
                </text>
              </g>
            ))}
            <line x1={0} x2={innerWidth} y1={yScale(0)} y2={yScale(0)}
              stroke="var(--text)" strokeWidth={1.5} opacity={0.4} />
            {MONTHS.map((m) => (
              <text key={m} x={xScale(m)} y={innerHeight + 18}
                textAnchor="middle" fontSize={10} fill="var(--text-muted)">{m}</text>
            ))}
            {sortedByDec.map((d) => (
              <text key={`label-${d.year}`}
                x={innerWidth + 5} y={labelPositions[d.year]}
                dominantBaseline="middle" fontSize={10}
                fill={colorScale(d.year)} fontWeight={600}>{d.year}</text>
            ))}
          </g>
        </g>

        {/* ── Morphing shapes — no <g transform>, absolute coords ── */}
        {renderData.map((d) => {
          const active = isActive(d.year);
          const cartPath = cartesianPaths.find((p) => p.year === d.year)?.path;
          const ringPath = ringPaths.find((p) => p.year === d.year)?.path;
          const path = isRadial ? ringPath : cartPath;

          return (
            <path
              key={`morph-${d.year}`}
              d={path}
              fill={colorScale(d.year)}
              fillOpacity={active ? 1.0 : 0.04}
              stroke={active ? "#f3f2ee" : "none"}
              strokeWidth={isRadial ? 1.5 : 0}
              style={{
                transition: "d 0.9s cubic-bezier(0.76, 0, 0.24, 1), fill-opacity 0.3s, stroke-width 0.4s",
              }}
            />
          );
        })}

      </svg>

      {/* Gradient legend + toggle */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 6, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>1880</span>
          <svg width={140} height={12}>
            <defs>
              <linearGradient id="tempGrad" x1="0%" x2="100%">
                <stop offset="0%"   stopColor="#15bc9d" />
                <stop offset="33%"  stopColor="#5800FF" />
                <stop offset="66%"  stopColor="#ffc600" />
                <stop offset="100%" stopColor="#b904ca" />
              </linearGradient>
            </defs>
            <rect x={0} y={2} width={140} height={8} rx={4} fill="url(#tempGrad)" />
          </svg>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>2020</span>
        </div>

        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
          <button onClick={() => setIsRadial(false)} style={{
            fontFamily: "var(--mono)", fontSize: 10, padding: "4px 12px",
            border: "none", cursor: "pointer",
            background: !isRadial ? "var(--text)" : "transparent",
            color: !isRadial ? "var(--bg)" : "var(--text-muted)",
          }}>▬ linear</button>
          <button onClick={() => setIsRadial(true)} style={{
            fontFamily: "var(--mono)", fontSize: 10, padding: "4px 12px",
            border: "none", borderLeft: "1px solid var(--border)", cursor: "pointer",
            background: isRadial ? "var(--text)" : "transparent",
            color: isRadial ? "var(--bg)" : "var(--text-muted)",
          }}>◎ spiral</button>
        </div>
      </div>
    </div>
  );
}