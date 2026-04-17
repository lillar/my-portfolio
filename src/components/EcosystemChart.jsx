import { useState } from "react";
import * as d3 from "d3";
import { iterations, cumulativeCost } from "../data/ecosystemData";

const COLOR_GOOD  = "#15bc9d";
const COLOR_OK    = "#ffc600";
const COLOR_POOR  = "#b904ca";

// ── Layout ────────────────────────────────────────────────
// Smaller edge margins so legend fits in the corner without overlapping axes
const width  = 520;
const height = 480;
const margin = { top: 96, right: 16, bottom: 80, left: 52 };
const innerW = width  - margin.left - margin.right;
const innerH = height - margin.top  - margin.bottom;

// Info panel sits at y=12 to 12+PANEL_H, above the chart area
const PANEL_H = 72;

// ── Compute cumulative costs per iteration ────────────────
const points = iterations.map(iter => ({
  ...iter,
  cum: cumulativeCost(iter.n),
}));

// ── Scales ────────────────────────────────────────────────
const maxCarbon = d3.max(points, d => d.cum.carbon);
const xScale = d3.scaleLinear()
  .domain([0, maxCarbon * 1.1])
  .range([0, innerW]);

const yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([innerH, 0]);

const maxTokens = d3.max(points, d => d.tokens);
const rScale = d3.scaleSqrt()
  .domain([0, maxTokens])
  .range([5, 20]);

// ── Line ──────────────────────────────────────────────────
const withScore = points.filter(d => d.satisfaction !== null);
const lineGen = d3.line()
  .x(d => xScale(d.cum.carbon))
  .y(d => yScale(d.satisfaction))
  .curve(d3.curveCatmullRom.alpha(0.5));

// ── Size legend data ──────────────────────────────────────
const sizeLegend = [
  { tokens: maxTokens,       label: `${(maxTokens / 1000).toFixed(1)}k` },
  { tokens: maxTokens * 0.5, label: `${(maxTokens * 0.5 / 1000).toFixed(1)}k` },
  { tokens: maxTokens * 0.2, label: `${(maxTokens * 0.2 / 1000).toFixed(1)}k` },
];

// ── Word wrap helper ──────────────────────────────────────
function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function EcosystemChart() {
  const [hovered,  setHovered]  = useState(null);
  const [selected, setSelected] = useState(1);

  const active = hovered ?? selected;
  const activeData = active != null ? points.find(p => p.n === active) : null;

  const handleClick = (n) => {
    setSelected(prev => prev === n ? null : n);
  };

  const yTicks = [0, 2, 4, 6, 8, 10];
  const xTicks = d3.ticks(0, maxCarbon, 5);

  // Wrap description to fit panel width
  const descLines = activeData ? wrapText(activeData.desc, 60) : [];

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Info panel at top ── */}
        {activeData && (
          <g transform={`translate(${margin.left}, 0)`}>
            {/* Card background */}
            <rect
              x={0} y={0}
              width={innerW} height={PANEL_H}
              rx={6} ry={6}
              fill="var(--bg)"
              stroke="var(--border)"
              strokeWidth={1}
            />

            {/* ── Left block: iteration pill + label ── */}
            <g transform="translate(14, 16)">
              <circle cx={9} cy={4} r={11}
                fill={activeData.satisfaction !== null ? COLOR_POOR : "var(--bg-card)"}
                stroke={activeData.satisfaction !== null ? "none" : "var(--border)"}
                strokeWidth={1.2}
                strokeDasharray={activeData.satisfaction !== null ? "none" : "3 2"}
              />
              <text x={9} y={4}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fontFamily="var(--mono)"
                fontWeight={700}
                fill={activeData.satisfaction !== null ? "var(--bg)" : "var(--text-muted)"}>
                {activeData.n}
              </text>
              <text x={28} y={4}
                dominantBaseline="middle"
                fontSize={13} fontFamily="var(--mono)"
                fontWeight={700}
                fill="var(--text)">
                {activeData.label}
              </text>
            </g>

            {/* ── Description — own row, wrapped ── */}
            {descLines.map((line, i) => (
              <text key={i}
                x={14} y={46 + i * 12}
                fontSize={10} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {line}
              </text>
            ))}

            {/* ── Right block: stats ── */}
            <g transform={`translate(${innerW - 14}, 16)`}>
              {/* Satisfaction — top */}
              <text x={0} y={4}
                textAnchor="end" dominantBaseline="middle"
                fontSize={14} fontFamily="var(--mono)"
                fontWeight={700}
                fill={activeData.satisfaction !== null ? "var(--text)" : "var(--text-muted)"}>
                {activeData.satisfaction ?? "—"}
                <tspan fontSize={10} fontWeight={400} fill="var(--text-muted)"> /10</tspan>
              </text>
              <text x={0} y={18}
                textAnchor="end"
                fontSize={8} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                satisfaction
              </text>

              {/* Tokens — below */}
              <text x={0} y={38}
                textAnchor="end" dominantBaseline="middle"
                fontSize={14} fontFamily="var(--mono)"
                fontWeight={700}
                fill="var(--text)">
                {(activeData.tokens / 1000).toFixed(1)}k
              </text>
              <text x={0} y={52}
                textAnchor="end"
                fontSize={8} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                tokens
              </text>
            </g>
          </g>
        )}

        {/* ── Chart body ── */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* Gridlines */}
          {yTicks.map(t => (
            <line key={t}
              x1={0} x2={innerW}
              y1={yScale(t)} y2={yScale(t)}
              stroke="var(--border)"
              strokeWidth={t === 0 ? 1 : 0.4}
              strokeDasharray={t === 0 ? "none" : "3 3"}
            />
          ))}
          {xTicks.map(t => (
            <line key={t}
              x1={xScale(t)} x2={xScale(t)}
              y1={0} y2={innerH}
              stroke="var(--border)" strokeWidth={0.4}
              strokeDasharray="3 3"
            />
          ))}

          {/* Satisfaction zones */}
          <rect x={0} y={yScale(10)} width={innerW}
            height={yScale(7) - yScale(10)}
            fill={COLOR_GOOD} fillOpacity={0.05} />
          <text x={innerW - 8} y={yScale(8.5)}
            textAnchor="end" dominantBaseline="middle"
            fontSize={11} fontFamily="var(--mono)"
            fill={COLOR_GOOD} fillOpacity={0.7}>
            good
          </text>

          <rect x={0} y={yScale(7)} width={innerW}
            height={yScale(4) - yScale(7)}
            fill={COLOR_OK} fillOpacity={0.04} />
          <text x={innerW - 8} y={yScale(5.5)}
            textAnchor="end" dominantBaseline="middle"
            fontSize={11} fontFamily="var(--mono)"
            fill={COLOR_OK} fillOpacity={0.7}>
            ok
          </text>

          <rect x={0} y={yScale(4)} width={innerW}
            height={yScale(0) - yScale(4)}
            fill={COLOR_POOR} fillOpacity={0.04} />
          <text x={innerW - 8} y={yScale(2)}
            textAnchor="end" dominantBaseline="middle"
            fontSize={11} fontFamily="var(--mono)"
            fill={COLOR_POOR} fillOpacity={0.7}>
            poor
          </text>

          {/* Connected path */}
          {withScore.length > 1 && (
            <path
              d={lineGen(withScore)}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={1.4}
              strokeDasharray="5 4"
              opacity={0.55}
            />
          )}

          {/* Dots */}
          {points.map(d => {
            const cx = xScale(d.cum.carbon);
            const hasScore = d.satisfaction !== null;
            const cy = hasScore ? yScale(d.satisfaction) : innerH / 2;
            const r  = rScale(d.tokens);
            const isActive = active === d.n;

            return (
              <g key={d.n}
                onMouseEnter={() => setHovered(d.n)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleClick(d.n)}
                style={{ cursor: "pointer" }}>

                <circle cx={cx} cy={cy} r={r + 8}
                  fill="transparent" />

                {!hasScore ? (
                  <circle cx={cx} cy={cy} r={r}
                    fill="var(--bg)"
                    stroke={isActive ? "var(--text)" : "var(--border)"}
                    strokeWidth={isActive ? 2 : 1.4}
                    strokeDasharray="3 2"
                  />
                ) : (
                  <circle cx={cx} cy={cy} r={r}
                    fill={COLOR_POOR}
                    fillOpacity={isActive ? 1 : 0.82}
                    stroke={isActive ? "var(--text)" : "var(--bg)"}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                )}

                <text x={cx} y={cy}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontFamily="var(--mono)"
                  fontWeight={700}
                  fill={hasScore ? "var(--bg)" : "var(--text-muted)"}
                  pointerEvents="none">
                  {d.n}
                </text>
              </g>
            );
          })}

          {/* Y axis */}
          <line x1={0} x2={0} y1={0} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />
          {yTicks.map(t => (
            <g key={t}>
              <line x1={-5} x2={0} y1={yScale(t)} y2={yScale(t)}
                stroke="var(--border)" strokeWidth={0.8} />
              <text x={-10} y={yScale(t)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={11} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}
          <text
            transform={`translate(-40, ${innerH / 2}) rotate(-90)`}
            textAnchor="middle" fontSize={11}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            satisfaction (1–10)
          </text>

          {/* X axis */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />
          {xTicks.map(t => (
            <g key={t}>
              <line x1={xScale(t)} x2={xScale(t)} y1={innerH} y2={innerH + 5}
                stroke="var(--border)" strokeWidth={0.8} />
              <text x={xScale(t)} y={innerH + 18}
                textAnchor="middle" fontSize={11}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                {t}g
              </text>
            </g>
          ))}
          <text x={innerW / 2} y={innerH + 38}
            textAnchor="middle" fontSize={11}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            cumulative CO₂ (g)
          </text>

          {/* ── Size legend: bottom-right, inline below chart ── */}
          {/* Fix 1: place ABOVE the X axis title row, anchored to innerW right edge */}
          {(() => {
            const sorted = [...sizeLegend].sort((a, b) => b.tokens - a.tokens);
            const radii  = sorted.map(s => rScale(s.tokens));
            const maxR   = radii[0];

            // Anchor: bottom right of plot area, just below X axis ticks
            // Ticks sit at innerH + 18, axis title at innerH + 38
            // Place legend at innerH + 62 (below axis title)
            const legendBottomY = innerH + 88;
            const legendRightX  = innerW;

            return (
              <g>
                {/* Text labels — right-aligned, left of circles */}
                <text
                  x={legendRightX - maxR * 2 - 12}
                  y={legendBottomY - maxR * 2 + 10}
                  textAnchor="end"
                  fontSize={10} fontFamily="var(--mono)"
                  fontWeight={600}
                  fill="var(--text-muted)">
                  {sorted[0].label} tokens
                </text>
                <text
                  x={legendRightX - maxR * 2 - 12}
                  y={legendBottomY - maxR * 2 + 22}
                  textAnchor="end"
                  fontSize={9} fontFamily="var(--mono)"
                  fill="var(--text-muted)"
                  opacity={0.7}>
                  dot size = tokens used
                </text>

                {/* Nested circles */}
                {sorted.map((s, i) => {
                  const r = radii[i];
                  return (
                    <circle key={i}
                      cx={legendRightX - maxR}
                      cy={legendBottomY - r}
                      r={r}
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth={1}
                      opacity={0.6}
                    />
                  );
                })}
              </g>
            );
          })()}
        </g>

      </svg>
    </div>
  );
}