import * as d3 from "d3";
import { useState, useMemo } from "react";
import { wageVsCostData } from "../data/wagevsCostData";

const width = 600;
const height = 700;
const margin = { top: 40, right: 140, bottom: 40, left: 140 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const COLOR_ABOVE = "#15bc9d"; // wage > cost = comfortable
const COLOR_BELOW = "#b904ca"; // wage < cost = struggling

export default function SlopeChart() {
  const [selected, setSelected] = useState("All");

  const countries = ["All", ...wageVsCostData.map((d) => d.country)];

  const maxVal = d3.max(wageVsCostData, (d) => Math.max(d.minWage, d.costOfLiving));

  // Y scale with 50 EUR ticks
  const yScale = d3.scaleLinear()
    .domain([0, Math.ceil(maxVal / 100) * 100])
    .range([innerHeight, 0]);

  const ticks = yScale.ticks(Math.ceil(maxVal / 100));

  const isHighlighted = (d) =>
    selected === "All" || d.country === selected;

  return (
    <div style={{ width: "100%" }}>
      {/* Dropdown */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 16, fontFamily: "var(--mono)", fontSize: 12,
        justifyContent: "center",
      }}>
        <label style={{ color: "var(--text-muted)" }}>Find your country:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            padding: "4px 8px",
            border: "1px solid var(--border)",
            borderRadius: 4,
            background: "var(--bg)",
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {selected !== "All" && (
          <button
            onClick={() => setSelected("All")}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              padding: "4px 8px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* Y axis grid + ticks */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={0} x2={innerWidth}
                y1={yScale(tick)} y2={yScale(tick)}
                stroke="var(--border)"
                strokeWidth={0.5}
                strokeDasharray="4 4"
              />
              <text
                x={-8}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={9}
                fontFamily="var(--mono)"
                fill="var(--text-muted)"
              >
                €{tick}
              </text>
            </g>
          ))}

          {/* Column headers */}
          <text x={0} y={-20} textAnchor="middle" fontSize={11}
            fontFamily="var(--mono)" fontWeight={600} fill="var(--text)">
            Min. Wage
          </text>
          <text x={innerWidth} y={-20} textAnchor="middle" fontSize={11}
            fontFamily="var(--mono)" fontWeight={600} fill="var(--text)">
            Cost of Living
          </text>

          {/* Slope lines */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            return (
              <line
                key={d.country}
                x1={0}
                y1={yScale(d.minWage)}
                x2={innerWidth}
                y2={yScale(d.costOfLiving)}
                stroke={color}
                strokeWidth={highlight ? 2 : 0.8}
                strokeOpacity={highlight ? 0.9 : 0.15}
              />
            );
          })}

          {/* Left dots + labels (min wage) */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            return (
              <g key={`left-${d.country}`} opacity={highlight ? 1 : 0.2}>
                <circle
                  cx={0} cy={yScale(d.minWage)} r={3}
                  fill={color}
                />
                <text
                  x={-10}
                  y={yScale(d.minWage)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={highlight ? 11 : 9}
                  fontFamily="var(--mono)"
                  fontWeight={highlight ? 600 : 400}
                  fill={highlight ? color : "var(--text-muted)"}
                >
                  €{d.minWage}
                </text>
              </g>
            );
          })}

          {/* Right dots + labels (cost of living) */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            return (
              <g key={`right-${d.country}`} opacity={highlight ? 1 : 0.2}>
                <circle
                  cx={innerWidth} cy={yScale(d.costOfLiving)} r={3}
                  fill={color}
                />
                <text
                  x={innerWidth + 10}
                  y={yScale(d.costOfLiving)}
                  dominantBaseline="middle"
                  fontSize={highlight ? 11 : 9}
                  fontFamily="var(--mono)"
                  fontWeight={highlight ? 600 : 400}
                  fill={highlight ? color : "var(--text-muted)"}
                >
                  €{d.costOfLiving} {d.country}
                </text>
              </g>
            );
          })}

        </g>

        {/* Legend */}
        <g transform={`translate(${margin.left}, ${height - 16})`}>
          <circle cx={0} cy={0} r={4} fill={COLOR_ABOVE} />
          <text x={8} y={0} dominantBaseline="middle" fontSize={10}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            wage covers costs
          </text>
          <circle cx={140} cy={0} r={4} fill={COLOR_BELOW} />
          <text x={148} y={0} dominantBaseline="middle" fontSize={10}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            costs exceed wage
          </text>
        </g>
      </svg>
    </div>
  );
}