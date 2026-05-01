import { useState } from "react";
import * as d3 from "d3";
import { incidents } from "../data/nuclearData";

// ── Colors ────────────────────────────────────────────────
const COLOR_US    = "#5800FF";
const COLOR_USSR  = "#b904ca";
const COLOR_OTHER = "#f97316";
const COLOR_HL    = "#ffc600";

// ── Layout ────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;   // taller canvas
const margin = { top: 52, right: 16, bottom: 52, left: 16 };
const innerW = VW - margin.left - margin.right;
const innerH = VH - margin.top  - margin.bottom;
const axisY  = innerH / 2;
const halfH  = axisY - 20;

// ── Scales ────────────────────────────────────────────────
const xScale = d3.scaleLinear()
  .domain([1948, 2025])
  .range([0, innerW]);

const stemScale = d3.scaleLinear()
  .domain([1, 10])
  .range([16, halfH - 8]);

// ── Helpers ───────────────────────────────────────────────
const sideColor = s => s === "US" ? COLOR_US : s === "USSR" ? COLOR_USSR : COLOR_OTHER;

function buildPositions() {
  const pos = incidents.map(d => ({ ...d, jitter: 0 }));
  const groups = {};
  pos.forEach((d, i) => {
    const key = `${d.side}-${d.year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(i);
  });
  Object.values(groups).forEach(idxs => {
    if (idxs.length < 2) return;
    const JITTER = 9;
    const spread = (idxs.length - 1) * JITTER;
    idxs.forEach((idx, i) => {
      pos[idx].jitter = -spread / 2 + i * JITTER;
    });
  });
  return pos;
}

const positions = buildPositions();


export default function NuclearChart() {
  const [hovered, setHovered] = useState(null);
  const hovInc = hovered !== null ? positions[hovered] : null;

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Title ── */}
        <text x={margin.left} y={18}
          textAnchor="start" fontSize={14}
          fontFamily="var(--mono)" fontWeight={700}
          fill="var(--text)">
          Nuclear close calls in history
        </text>
        <text x={margin.left} y={34}
          textAnchor="start" fontSize={10}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          1950–2022 · stem height = estimated severity (1–10)
        </text>

                {/* ── Legend ── */}
        <g transform={`translate(${margin.left}, ${VH - 24})`}>
          <circle cx={6} cy={6} r={6} fill="var(--text-muted)" fillOpacity={0.7} />
          <text x={16} y={10} fontSize={10} fontFamily="var(--mono)" fill="var(--text-muted)">
            intentional
          </text>
          <circle cx={96} cy={6} r={6} fill="var(--bg)"
            stroke="var(--text-muted)" strokeWidth={2} />
          <text x={106} y={10} fontSize={10} fontFamily="var(--mono)" fill="var(--text-muted)">
            unintentional
          </text>
          <circle cx={204} cy={6} r={6} fill={COLOR_OTHER} />
          <text x={214} y={10} fontSize={10} fontFamily="var(--mono)" fill="var(--text-muted)">
            other country
          </text>
          <circle cx={308} cy={6} r={6} fill={COLOR_US} />
          <text x={318} y={10} fontSize={10} fontFamily="var(--mono)" fill={COLOR_US}>
            USA
          </text>
          <circle cx={356} cy={6} r={6} fill={COLOR_USSR} />
          <text x={366} y={10} fontSize={10} fontFamily="var(--mono)" fill={COLOR_USSR}>
            USSR / Russia
          </text>
        </g>

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Side labels ── */}
          <text x={4} y={axisY - halfH + 4}
            fontSize={11} fontFamily="var(--mono)"
            fontWeight={700} fill={COLOR_US}>
            USA
          </text>
          <text x={4} y={axisY + halfH + 10}
            fontSize={11} fontFamily="var(--mono)"
            fontWeight={700} fill={COLOR_USSR}>
            USSR / Russia
          </text>

          {/* ── Centre axis ── */}
          <line x1={0} x2={innerW} y1={axisY} y2={axisY}
            stroke="var(--border)" strokeWidth={1.2} />

          {/* ── X ticks ── */}
          {[1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map(t => (
            <g key={t}>
              <line x1={xScale(t)} x2={xScale(t)}
                y1={axisY - 5} y2={axisY + 5}
                stroke="var(--border)" strokeWidth={0.9} />
              <text x={xScale(t)} y={axisY + 18}
                textAnchor="middle" fontSize={10}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}

          {/* ── Lollipops ── */}
          {positions.map((d, i) => {
            const isHov  = hovered === i;
            const color  = isHov ? COLOR_HL : sideColor(d.side);
            const cx     = xScale(d.year) + d.jitter;
            const stem   = stemScale(d.severity);
            const filled = d.type === "intentional";
            const r      = d.side === "OTHER" ? 7 : isHov ? 8 : 6;

            let cy1, cy2, dotCY;
            if (d.side === "US") {
            cy1   = axisY - 1;
            dotCY = axisY - stem;
            cy2   = dotCY + r;   // stem ends at top edge of dot
            } else if (d.side === "USSR") {
            cy1   = axisY + 1;
            dotCY = axisY + stem;
            cy2   = dotCY - r;   // stem ends at bottom edge of dot
            } else {
            dotCY = axisY;
            }

            return (
              <g key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}>

                {/* Invisible hit zone */}
                {d.side !== "OTHER" && (
                  <line x1={cx} x2={cx} y1={cy1} y2={cy2}
                    stroke="transparent" strokeWidth={14} />
                )}

                {/* Stem */}
                {d.side !== "OTHER" && (
                  <line x1={cx} x2={cx} y1={cy1} y2={cy2}
                    stroke={color}
                    strokeWidth={isHov ? 3 : d.famous ? 2 : 1.2}
                    strokeOpacity={isHov ? 1 : d.famous ? 0.75 : 0.25}
                    pointerEvents="none" />
                )}

                {/* Dot */}
                {filled ? (
                  <circle cx={cx} cy={dotCY} r={r}
                    fill={color}
                    fillOpacity={isHov ? 1 : d.famous ? 0.85 : 0.2}
                    stroke="var(--bg)" strokeWidth={1.5}
                    style={{ cursor: "pointer" }} />
                ) : (
                  <circle cx={cx} cy={dotCY} r={r}
                    fill="var(--bg)"
                    stroke={color}
                    strokeWidth={isHov ? 2.5 : d.famous ? 2 : 1.2}
                    strokeOpacity={isHov ? 1 : d.famous ? 0.85 : 0.2}
                    style={{ cursor: "pointer" }} />
                )}

              </g>
            );
          })}

          {/* ── Tooltip ── */}
          {hovInc && (() => {
            const cx     = xScale(hovInc.year) + hovInc.jitter;
            const stem   = stemScale(hovInc.severity);
            const isUS   = hovInc.side === "US";
            const isOther = hovInc.side === "OTHER";
            const TW     = 344;
            const TH     = 56;
            const TR     = 5;
            const tx     = Math.min(Math.max(cx - TW / 2, 2), innerW - TW - 2);
            const ty     = isUS || isOther
              ? axisY - stem - TH - 14
              : axisY + stem + 14;

            return (
              <g pointerEvents="none">
                <rect x={tx} y={ty} width={TW} height={TH} rx={TR}
                  fill="var(--bg)" stroke={sideColor(hovInc.side)} strokeWidth={1}
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }} />

                {/* Year */}
                <text x={tx + 10} y={ty + 16}
                  fontSize={10} fontFamily="var(--mono)"
                  fontWeight={700} fill="var(--text)">
                  {hovInc.year}
                </text>

                {/* Title */}
                <text x={tx + 10} y={ty + 28}
                  fontSize={10} fontFamily="var(--mono)"
                  fontWeight={700} fill="var(--text)">
                  {hovInc.title}
                </text>

                {/* Severity + type */}
                <text x={tx + 10} y={ty + TH - 8}
                  fontSize={10} fontFamily="var(--mono)"
                  fill={sideColor(hovInc.side)}>
                  severity {hovInc.severity}/10 · {hovInc.type}
                </text>
              </g>
            );
          })()}

        </g>

      </svg>
    </div>
  );
}