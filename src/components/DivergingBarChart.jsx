import { useState } from "react";
import * as d3 from "d3";
import { euData, annotations } from "../data/multiscaleData";

const COLOR_GDP = "#15bc9d";  // teal
const COLOR_GHG = "#b904ca";  // magenta

const width = 620;
const height = 500;
const margin = { top: 60, right: 52, bottom: 36, left: 52 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Zero line sits at center — both axes share same zero
const ZERO_Y = innerHeight / 2;

// Independent scales, but both anchored at same zero pixel
const gdpMax = d3.max(euData, (d) => Math.abs(d.gdp)) + 0.5;
const ghgMax = d3.max(euData, (d) => Math.abs(d.ghg)) + 0.5;

// GDP: positive → upward from center, negative → downward from center
// Maps [0, gdpMax] → [ZERO_Y, 0] (up), [-gdpMax, 0] → [innerHeight, ZERO_Y] (down)
const yGDP = d3.scaleLinear()
  .domain([-gdpMax, gdpMax])
  .range([innerHeight, 0]);

// GHG: negative → downward from center, positive → upward from center
// Mirror of GDP: same pixel zero, but inverted meaning
const yGHG = d3.scaleLinear()
  .domain([ghgMax, -ghgMax])  // flipped domain so negative goes DOWN visually
  .range([innerHeight, 0]);

const xScale = d3.scaleBand()
  .domain(euData.map((d) => d.year))
  .range([0, innerWidth])
  .padding(0.15);

const BAR_W = xScale.bandwidth();

export default function DivergingChart() {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const handleMouseEnter = (e, d) => {
    setHovered(d.year);
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      year: d.year, gdp: d.gdp, ghg: d.ghg,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => { setHovered(null); setTooltip(null); };

  // GDP ticks on left
  const gdpTicks = yGDP.ticks(6);
  // GHG ticks on right — show as negative-down values
  const ghgTicks = yGHG.ticks(6);

  const zeroY = yGDP(0); // pixel position of zero line

  return (
    <div style={{ width: "100%", position: "relative", fontFamily: "var(--mono)", overflow: "visible" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block", overflow: "visible" }}>

        {/* Axis labels */}
        <text x={margin.left - 8} y={14} textAnchor="middle"
          fontSize={12} fontWeight={600} fill={COLOR_GDP}>GDP %</text>
        <text x={margin.left - 8} y={26} textAnchor="middle"
          fontSize={10} fill="var(--text-muted)">← left axis</text>

        <text x={width - margin.right + 8} y={14} textAnchor="middle"
          fontSize={12} fontWeight={600} fill={COLOR_GHG}>GHG %</text>
        <text x={width - margin.right + 8} y={26} textAnchor="middle"
          fontSize={10} fill="var(--text-muted)">right axis →</text>

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* GDP gridlines + left axis ticks */}
          {gdpTicks.map((tick) => (
            <g key={`gdp-${tick}`}>
              <line
                x1={0} x2={innerWidth}
                y1={yGDP(tick)} y2={yGDP(tick)}
                stroke="var(--border)"
                strokeWidth={tick === 0 ? 1.5 : 0.4}
                strokeDasharray={tick === 0 ? "none" : "3 3"}
              />
              <text
                x={-8} y={yGDP(tick)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={10} fill={COLOR_GDP} fillOpacity={0.8}
              >
                {tick > 0 ? `+${tick}` : tick}%
              </text>
            </g>
          ))}

          {/* GHG right axis ticks */}
          {ghgTicks.map((tick) => (
            <text
              key={`ghg-${tick}`}
              x={innerWidth + 8} y={yGHG(tick)}
              textAnchor="start" dominantBaseline="middle"
              fontSize={10} fill={COLOR_GHG} fillOpacity={0.8}
            >
              {tick > 0 ? `+${tick}` : tick}%
            </text>
          ))}

          {/* Zero baseline */}
          <line
            x1={0} x2={innerWidth}
            y1={zeroY} y2={zeroY}
            stroke="var(--text)" strokeWidth={1} opacity={0.5}
          />

          {/* Bars */}
          {euData.map((d) => {
            const isHovered = hovered === d.year;
            const x = xScale(d.year);

            // GDP bar: from zero up or down
            const gdpY0 = yGDP(0);
            const gdpY1 = yGDP(d.gdp);
            const gdpTop = Math.min(gdpY0, gdpY1);
            const gdpH = Math.abs(gdpY0 - gdpY1);

            // GHG bar: negative GHG → goes DOWN from center (yGHG maps negative to lower pixels)
            const ghgY0 = yGHG(0);
            const ghgY1 = yGHG(d.ghg);
            const ghgTop = Math.min(ghgY0, ghgY1);
            const ghgH = Math.abs(ghgY0 - ghgY1);

            return (
              <g
                key={d.year}
                onMouseEnter={(e) => handleMouseEnter(e, d)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              >
                {/* Hover highlight band */}
                {isHovered && (
                  <rect
                    x={x - 1} y={0}
                    width={BAR_W + 2} height={innerHeight}
                    fill="var(--border)" fillOpacity={0.2} rx={2}
                  />
                )}

                {/* GHG bar — drawn first (underneath) */}
                <rect
                  x={x} y={ghgTop}
                  width={BAR_W} height={ghgH}
                  fill={COLOR_GHG}
                  fillOpacity={isHovered ? 0.9 : 0.6}
                  rx={1.5}
                />

                {/* GDP bar — drawn on top, also semi-opaque */}
                <rect
                  x={x} y={gdpTop}
                  width={BAR_W} height={gdpH}
                  fill={COLOR_GDP}
                  fillOpacity={isHovered ? 0.9 : 0.6}
                  rx={1.5}
                />

                {/* Year label */}
                <text
                  x={x + BAR_W / 2}
                  y={innerHeight + 14}
                  textAnchor="middle"
                  fontSize={d.year % 5 === 0 ? 9 : 7}
                  fontWeight={d.year % 5 === 0 ? 600 : 400}
                  fill={isHovered ? "var(--text)" : "var(--text-muted)"}
                >
                  {d.year % 5 === 0 || isHovered ? d.year : ""}
                </text>
              </g>
            );
          })}

          {/* Annotations */}
{annotations.map((a) => {
  const x = xScale(a.year) + BAR_W / 2;
  const above = a.year === 2009 || a.year === 2020;

  // For bottom labels, anchor to the GHG bar bottom instead of innerHeight
  const d = euData.find((d) => d.year === a.year);
  const barBottom = d ? Math.max(yGHG(0), yGHG(d.ghg)) + 6 : innerHeight + 10;

  const yLine1 = above ? -10 : barBottom;
  const yLine2 = above ? -3  : barBottom + 6;
  const yText  = above ? -14 : barBottom + 16;

  return (
    <g key={a.year}>
      <line x1={x} x2={x} y1={yLine1} y2={yLine2}
        stroke="var(--text-muted)" strokeWidth={0.8} />
      <text x={x} y={yText} textAnchor="middle"
        fontSize={10} fill="var(--text-muted)">{a.label}</text>
    </g>
  );
})}

        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x > width * 0.6 ? tooltip.x - 150 : tooltip.x + 12,
          top: tooltip.y - 12,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "6px 10px",
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text)", pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.year}</div>
          <div style={{ color: COLOR_GDP }}>
            GDP: {tooltip.gdp > 0 ? "+" : ""}{tooltip.gdp.toFixed(1)}%
          </div>
          <div style={{ color: COLOR_GHG }}>
            GHG: {tooltip.ghg > 0 ? "+" : ""}{tooltip.ghg.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        marginTop: 4, fontSize: 10, color: "var(--text-muted)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_GDP, opacity: 0.7 }} />
          <span>EU-27 GDP growth (up = growing)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: COLOR_GHG, opacity: 0.7 }} />
          <span>EU-27 GHG change (up = dropping)</span>
        </div>
      </div>
    </div>
  );
}