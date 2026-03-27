import * as d3 from "d3";
import { useState } from "react";
import { populationData } from "../data/populationData";

const width = 500;
const height = 500;
const cx = width / 2;
const cy = height / 2;
const radius = Math.min(width, height) / 2;

const continentColors = {
  Asia:     "#8d6247",  // warm brown
  Africa:   "#e6b84a",  // golden amber
  Europe:   "#5a9e7a",  // fresh green
  Americas: "#5774a9",  // muted blue
  Oceania:  "#a78bb8",  // dusty mauve
};

export default function PopulationSunburst() {
  const [tooltip, setTooltip] = useState(null);

  // ── Build hierarchy ─────────────────────────────────────
  const root = d3.hierarchy(populationData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  // ── Partition layout ────────────────────────────────────
  d3.partition().size([2 * Math.PI, radius])(root);

  // ── Arc generator ───────────────────────────────────────
  const arc = d3.arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0 === 0 ? 0 : d.y0)
    .outerRadius((d) => d.y1);

  const getColor = (d) => {
    if (d.depth === 0) return "var(--bg-card)";
    const continent = d.depth === 1 ? d.data.name : d.parent.data.name;
    const base = continentColors[continent] || "#999";
    return d.depth === 1 ? base : base + "99"; // countries more transparent
  };

  const descendants = root.descendants().filter((d) => d.depth > 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
      <g transform={`translate(${cx}, ${cy})`}>

        {descendants.map((d, i) => {
          const midAngle = (d.x0 + d.x1) / 2;
          const showLabel = d.depth === 1 && (d.x1 - d.x0) > 0.2;
          const labelR = (d.y0 + d.y1) /2;
          const lx = labelR * Math.sin(midAngle);
          const ly = -labelR * Math.cos(midAngle);

          return (
            <g key={i}>
              <path
                d={arc(d)}
                fill={getColor(d)}
                stroke="var(--bg)"
                strokeWidth={1}
                onMouseEnter={() => setTooltip(d)}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              />
              {showLabel && (
                <text
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontFamily="var(--mono)"
                  fill="white"
                  pointerEvents="none"
                >
                  {d.data.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Center text */}
        <text textAnchor="middle" y={-8} fontSize={13} fontFamily="var(--mono)" fill="var(--text-muted)">
          TOP 10 COUNTRIES
        </text>
        <text textAnchor="middle" y={8} fontSize={12} fontFamily="var(--mono)" fill="var(--text-muted)">
          PER CONTINENT
        </text>

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect x={-70} y={-36} width={140} height={60}
              fill="var(--bg)" stroke="var(--border)" rx={4} />
            <text textAnchor="middle" y={-16} fontSize={12} fontWeight={600} fill="var(--text)">
              {tooltip.data.name}
            </text>
            <text textAnchor="middle" y={2} fontSize={11} fill="var(--text-muted)">
              {tooltip.value.toLocaleString()}M people
            </text>
            <text textAnchor="middle" y={18} fontSize={11} fill="var(--text-muted)">
              {((tooltip.value / root.value) * 100).toFixed(1)}% of Total
            </text>
          </g>
        )}

      </g>
    </svg>
  );
}