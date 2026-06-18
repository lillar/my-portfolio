import { useMemo, useState } from "react";
import * as d3 from "d3";
import { planets } from "../data/exoplanetData";
import { candidates } from "../data/candidateData";

// ── Colors ─────────────────────────────────────────────────────────────────
const BG          = "#0b0f1a";
const COLOR_CONF  = "#ffc600";
const COLOR_NAMED = "#c084fc";
const COLOR_CAND  = "#888";
const COLOR_EARTH = "#15bc9d";
const COLOR_BOUND = "#ffffff";

// ── Canvas (bleeds to edges — outer div uses negative margin) ──────────────
const VW = 500, VH = 500;
const CX = VW / 2, CY = VH / 2;

// ── Geometry ───────────────────────────────────────────────────────────────
// Main diagonal (Earth = 0 ly): BL(0,VH) → TR(VW,0)   line: x+y = VH
// Confirmed triangle (above diagonal): x+y < VH
// Candidate triangle (below diagonal): x+y > VH
//
// Perpendicular offset v from diagonal:
//   confirmed direction: (-1/√2, -1/√2)   toward TL
//   candidate direction: ( 1/√2,  1/√2)   toward BR
//
// At diagonal param t ∈ [0,1], base = (VW·t, VH·(1−t)):
//   confirmed: (VW·t − v/√2,  VH·(1−t) − v/√2)
//   candidate: (VW·t + v/√2,  VH·(1−t) + v/√2)
//
// Canvas constraint: t ∈ [v/(VH·√2), 1 − v/(VH·√2)] — closes the triangle
const MAX_PERP = VH / Math.SQRT2;   // ≈ 353.6 px

const dScale = d3.scaleSqrt()
  .domain([0, 30000])
  .range([0, MAX_PERP])
  .clamp(true);

const rScale = d3.scaleSqrt()
  .domain([0.4, 28])
  .range([1, 6]);

function jitter(i, range) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * range;
}

function confirmedCoords(d, i) {
  const v = dScale(d);
  const halfRange = Math.max(0, 0.5 - v / (VH * Math.SQRT2)) * 0.92;
  const t = 0.5 + jitter(i, 2) * halfRange;
  return { x: VW * t - v / Math.SQRT2, y: VH * (1 - t) - v / Math.SQRT2 };
}

function candidateCoords(d, i) {
  const v = dScale(d);
  const halfRange = Math.max(0, 0.5 - v / (VH * Math.SQRT2)) * 0.92;
  const t = 0.5 + jitter(i * 31 + 7, 2) * halfRange;
  return { x: VW * t + v / Math.SQRT2, y: VH * (1 - t) + v / Math.SQRT2 };
}

// ── Distance ticks along the 30k boundary lines ────────────────────────────
// Confirmed boundary: TL(0,0) → center — frac = dScale(d)/MAX_PERP
//   point = (CX·(1−frac), CY·(1−frac))
// Candidate boundary: center → BR(VW,VH)
//   point = (CX·(1+frac), CY·(1+frac))
const DIST_TICKS = [1000, 5000, 15000];

// ── Component ───────────────────────────────────────────────────────────────
export default function ExoplanetChart() {
  const [hovered, setHovered] = useState(null);

  const confirmedDots = useMemo(() =>
    planets.map((p, i) => ({
      ...p,
      ...confirmedCoords(p.d, i),
      r: rScale(Math.min(p.r, 28)),
    })), []);

  const candidateDots = useMemo(() =>
    candidates.map((p, i) => ({
      ...p,
      ...candidateCoords(p.d, i),
      r: rScale(Math.min(p.r, 28)),
    })), []);

  const hov = hovered
    ? (hovered.side === "confirmed" ? confirmedDots[hovered.i] : candidateDots[hovered.i])
    : null;

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}>

        {/* ── Background ── */}
        <rect x={0} y={0} width={VW} height={VH} fill={BG} />

        {/* ── 30k boundary lines ── */}
        <line x1={0} y1={0} x2={CX} y2={CY}
          stroke={COLOR_BOUND} strokeWidth={0.5} strokeOpacity={0.2} />
        <line x1={CX} y1={CY} x2={VW} y2={VH}
          stroke={COLOR_BOUND} strokeWidth={0.5} strokeOpacity={0.2} />

        {/* ── Distance ticks on boundary lines ── */}
        {DIST_TICKS.map(d => {
          const frac = dScale(d) / MAX_PERP;
          const cx_conf = CX * (1 - frac), cy_conf = CY * (1 - frac);
          const cx_cand = CX * (1 + frac), cy_cand = CY * (1 + frac);
          const TICK = 4;
          const dt = TICK / Math.SQRT2;
          const label = d >= 1000 ? `${d / 1000}k ly` : `${d} ly`;
          return (
            <g key={d}>
              {/* confirmed boundary tick + label */}
              <line x1={cx_conf - dt} y1={cy_conf + dt}
                    x2={cx_conf + dt} y2={cy_conf - dt}
                stroke={COLOR_BOUND} strokeWidth={0.8} strokeOpacity={0.45} />
              <text x={cx_conf + 6} y={cy_conf - 4}
                fontSize={6.5} fontFamily="var(--mono)"
                fill={COLOR_BOUND} fillOpacity={0.4} textAnchor="start">
                {label}
              </text>
              {/* candidate boundary tick + label */}
              <line x1={cx_cand - dt} y1={cy_cand + dt}
                    x2={cx_cand + dt} y2={cy_cand - dt}
                stroke={COLOR_BOUND} strokeWidth={0.8} strokeOpacity={0.45} />
              <text x={cx_cand - 6} y={cy_cand + 13}
                fontSize={6.5} fontFamily="var(--mono)"
                fill={COLOR_BOUND} fillOpacity={0.4} textAnchor="end">
                {label}
              </text>
            </g>
          );
        })}

        {/* ── Candidate dots (lower-right triangle, rendered first) ── */}
        {candidateDots.map((p, i) => {
          const isHov = hovered?.side === "candidate" && hovered.i === i;
          return (
            <circle key={`k-${i}`}
              cx={p.x} cy={p.y} r={isHov ? p.r + 2 : p.r}
              fill={COLOR_CAND}
              fillOpacity={isHov ? 1 : 0.6}
              stroke={isHov ? "#fff" : "none"} strokeWidth={1.5}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered({ side: "candidate", i })}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* ── Unnamed confirmed dots ── */}
        {confirmedDots.map((p, i) => p.name ? null : (
          <circle key={`c-${i}`}
            cx={p.x} cy={p.y} r={hovered?.side === "confirmed" && hovered.i === i ? p.r + 2 : p.r}
            fill={COLOR_CONF}
            fillOpacity={hovered?.side === "confirmed" && hovered.i === i ? 1 : 0.78}
            stroke={hovered?.side === "confirmed" && hovered.i === i ? "#fff" : "none"} strokeWidth={1.5}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered({ side: "confirmed", i })}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* ── Named confirmed dots — rendered on top at full opacity ── */}
        {confirmedDots.map((p, i) => !p.name ? null : (
          <circle key={`cn-${i}`}
            cx={p.x} cy={p.y} r={hovered?.side === "confirmed" && hovered.i === i ? p.r + 2 : p.r}
            fill={COLOR_NAMED}
            fillOpacity={hovered?.side === "confirmed" && hovered.i === i ? 1 : 0.95}
            stroke={hovered?.side === "confirmed" && hovered.i === i ? "#fff" : BG} strokeWidth={0.8}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered({ side: "confirmed", i })}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* ── Main diagonal: Earth (0 ly) ── */}
        <line x1={0} y1={VH} x2={VW} y2={0}
          stroke={COLOR_EARTH} strokeWidth={0.8} strokeOpacity={0.5} />

        {/* ── Earth marker ── */}
        <circle cx={CX} cy={CY} r={5}
          fill={COLOR_EARTH} stroke={BG} strokeWidth={1.5} />
        <text x={CX + 9} y={CY - 7}
          fontSize={8} fontFamily="var(--mono)" fontWeight={700}
          fill={COLOR_EARTH}>
          Earth
        </text>

        {/* ── Section labels ── */}
        <text x={12} y={18}
          fontSize={8} fontFamily="var(--mono)"
          fill={COLOR_CONF} fillOpacity={0.75}>
          confirmed ({planets.length.toLocaleString()})
        </text>
        <text x={VW - 12} y={VH - 8}
          textAnchor="end" fontSize={8} fontFamily="var(--mono)"
          fill={COLOR_CAND} fillOpacity={0.75}>
          TESS candidates ({candidates.length.toLocaleString()})
        </text>

        {/* ── Tooltip ── */}
        {hov && (() => {
          const TW = 170, TH = hov.name ? 34 : 24, TR = 4;
          const tx = Math.min(Math.max(hov.x - TW / 2, 4), VW - TW - 4);
          const ty = hov.y > CY ? hov.y - TH - 12 : hov.y + 12;
          return (
            <g pointerEvents="none">
              <rect x={tx} y={ty} width={TW} height={TH} rx={TR}
                fill="#1e2438" stroke="#3a4060" strokeWidth={1} />
              {hov.name && (
                <text x={tx + 8} y={ty + 14}
                  fontSize={9} fontFamily="var(--mono)"
                  fontWeight={700} fill="#f1f5f9">
                  {hov.name}
                </text>
              )}
              <text x={tx + 8} y={ty + (hov.name ? 27 : 15)}
                fontSize={8} fontFamily="var(--mono)" fill="#94a3b8">
                {hov.r} R⊕ · {hov.d.toLocaleString()} ly
              </text>
            </g>
          );
        })()}

      </svg>
    </div>
  );
}
