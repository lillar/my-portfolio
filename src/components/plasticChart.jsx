import { useState } from "react";
import * as d3 from "d3";
import { data, MT_PER_ICON } from "../data/plasticData";

// ── Colors ────────────────────────────────────────────────
const COLOR_FULL    = "#5800FF";  // purple — full bottles
const COLOR_PARTIAL = "#5800FF";  // same, lower opacity for fractional
const COLOR_HL      = "#f97316";  // orange — hovered bar

// ── Layout ────────────────────────────────────────────────
const VW      = 500;
const VH      = 500;
const margin  = { top: 52, right: 20, bottom: 32, left: 42 };
const innerW  = VW - margin.left - margin.right;
const innerH  = VH - margin.top  - margin.bottom;

const N       = data.length;
const BAR_H   = innerH / N;         // height per row
const ICON_H  = BAR_H * 0.72;       // bottle height
const ICON_W  = ICON_H * 0.38;      // bottle width (tall & narrow)
const PAD_X   = 2;                  // gap between icons

// Max icons per row
const MAX_MT    = 470;
const MAX_ICONS = MAX_MT / MT_PER_ICON;  // 46
const ROW_W     = innerW;
const STEP      = ROW_W / MAX_ICONS;     // px per icon slot

// ── Bottle SVG path (normalized 0-1 viewBox, pointing up) ──
// Simple bottle silhouette: cap → neck → shoulder → body → base
function bottlePath(x, y, w, h) {
  const cx = x + w / 2;
  // Proportions (fraction of height)
  const capH   = h * 0.12;
  const neckH  = h * 0.15;
  const neckW  = w * 0.38;
  const bodyH  = h * 0.73;
  const bodyW  = w;

  const top    = y;
  const capBot = y + capH;
  const neckBot= y + capH + neckH;
  const bot    = y + h;

  return [
    // Cap (rectangle)
    `M${cx - neckW * 0.6},${top}`,
    `L${cx + neckW * 0.6},${top}`,
    `L${cx + neckW * 0.6},${capBot}`,
    `L${cx - neckW * 0.6},${capBot}`,
    `Z`,
    // Neck + shoulder + body
    `M${cx - neckW / 2},${capBot}`,
    `L${cx + neckW / 2},${capBot}`,
    // Shoulder curve out to body width
    `C${cx + neckW / 2},${neckBot} ${cx + bodyW / 2},${neckBot} ${cx + bodyW / 2},${neckBot + h * 0.08}`,
    // Body sides
    `L${cx + bodyW / 2},${bot - h * 0.04}`,
    // Rounded base
    `Q${cx + bodyW / 2},${bot} ${cx},${bot}`,
    `Q${cx - bodyW / 2},${bot} ${cx - bodyW / 2},${bot - h * 0.04}`,
    `L${cx - bodyW / 2},${neckBot + h * 0.08}`,
    `C${cx - bodyW / 2},${neckBot} ${cx - neckW / 2},${neckBot} ${cx - neckW / 2},${capBot}`,
    `Z`,
  ].join(" ");
}

export default function PlasticChart() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Title ── */}
        <text x={margin.left} y={16}
          textAnchor="start" fontSize={14}
          fontFamily="var(--mono)" fontWeight={700}
          fill="var(--text)">
          The plastic planet
        </text>
        <text x={margin.left} y={31}
          textAnchor="start" fontSize={10}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          Global plastic production · million metric tonnes · each bottle = 10 Mt
        </text>

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Bars ── */}
          {data.map((d, i) => {
            const isHov    = hovered === d.year;
            const color    = isHov ? COLOR_HL : COLOR_FULL;
            const icons    = d.mt / MT_PER_ICON;
            const fullIcons = Math.floor(icons);
            const frac      = icons - fullIcons;
            const rowY      = i * BAR_H + (BAR_H - ICON_H) / 2;

            return (
              <g key={d.year}
                onMouseEnter={() => setHovered(d.year)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}>

                {/* Hit area */}
                <rect x={0} y={i * BAR_H} width={innerW} height={BAR_H}
                  fill="transparent" />

                {/* Full bottles */}
                {Array.from({ length: fullIcons }).map((_, bi) => (
                  <path key={bi}
                    d={bottlePath(bi * STEP + PAD_X, rowY, ICON_W, ICON_H)}
                    fill={color} fillOpacity={0.8} />
                ))}

                {/* Fractional bottle (clipped) */}
                {frac > 0 && (() => {
                  const bx  = fullIcons * STEP + PAD_X;
                  const clipId = `clip-${d.year}`;
                  return (
                    <g>
                      <defs>
                        <clipPath id={clipId}>
                          <rect x={bx} y={rowY}
                            width={ICON_W * frac} height={ICON_H} />
                        </clipPath>
                      </defs>
                      {/* Ghost bottle */}
                      <path d={bottlePath(bx, rowY, ICON_W, ICON_H)}
                        fill={color} fillOpacity={0.15} />
                      {/* Filled portion */}
                      <path d={bottlePath(bx, rowY, ICON_W, ICON_H)}
                        fill={color} fillOpacity={0.8}
                        clipPath={`url(#${clipId})`} />
                    </g>
                  );
                })()}

                {/* Year label */}
                <text x={-6} y={i * BAR_H + BAR_H / 2}
                  textAnchor="end" dominantBaseline="middle"
                  fontSize={isHov ? 11 : 10}
                  fontFamily="var(--mono)"
                  fontWeight={isHov ? 700 : 400}
                  fill={isHov ? "var(--text)" : "var(--text-muted)"}>
                  {d.year}
                </text>

                {/* Value label on hover */}
                {isHov && (
                  <text
                    x={fullIcons * STEP + (frac > 0 ? ICON_W + 4 : 4)}
                    y={i * BAR_H + BAR_H / 2}
                    dominantBaseline="middle"
                    fontSize={10} fontFamily="var(--mono)"
                    fontWeight={700} fill={COLOR_HL}>
                    {d.mt} Mt
                  </text>
                )}

              </g>
            );
          })}

          {/* ── Bottom axis line ── */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />

          {/* ── X axis ticks ── */}
          {[0, 100, 200, 300, 400].map(t => {
            const x = (t / MT_PER_ICON) * STEP;
            return (
              <g key={t}>
                <line x1={x} x2={x} y1={innerH} y2={innerH + 4}
                  stroke="var(--border)" strokeWidth={0.6} />
                <text x={x} y={innerH + 14}
                  textAnchor="middle" fontSize={10}
                  fontFamily="var(--mono)" fill="var(--text-muted)">
                  {t === 0 ? "0" : `${t} Mt`}
                </text>
              </g>
            );
          })}

        </g>
      </svg>
    </div>
  );
}