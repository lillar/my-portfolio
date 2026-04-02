import * as d3 from "d3";
import { useState, useMemo } from "react";
import { forestData } from "../data/forestData";

const CONTAINER_WIDTH = 700;
const CONTAINER_HEIGHT = 500;
const TREE_SIZE = 10;

const sorted = [...forestData].sort((a, b) => b.forestPct - a.forestPct);

const TreeIcon = ({ x, y, size, opacity }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <rect
      x={size * 0.4} y={size * 0.7}
      width={size * 0.2} height={size * 0.3}
      fill="#5d4037"
    />
    <polygon
      points={`${size * 0.5},0 ${size},${size * 0.75} 0,${size * 0.75}`}
      fill="#2d6a4f"
    />
  </g>
);

export default function ForestPictogram() {
  const [tooltip, setTooltip] = useState(null);

  const treemapNodes = useMemo(() => {
    const root = d3
      .hierarchy({ name: "europe", children: sorted })
      .sum((d) => d.area || 0);

    d3.treemap()
      .size([CONTAINER_WIDTH, CONTAINER_HEIGHT])
      .padding(1)(root);

    return root.leaves();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8  }}>

      {/* SVG container — aspect ratio box */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <svg
          viewBox={`0 0 ${CONTAINER_WIDTH} ${CONTAINER_HEIGHT}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0, display: "block" }}
        >
          {treemapNodes.map((node, i) => {
            const d = node.data;
            const x0 = node.x0;
            const y0 = node.y0;
            const w = node.x1 - node.x0;
            const h = node.y1 - node.y0;

            const forestHeight = h * (d.forestPct / 100);
            const forestY = y0 + h - forestHeight;

            const cols = Math.floor(w / TREE_SIZE);
            const rows = Math.floor(forestHeight / TREE_SIZE);
            const trees = [];
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                trees.push({
                  x: x0 + col * TREE_SIZE,
                  y: forestY + row * TREE_SIZE,
                });
              }
            }

            return (
              <g
                key={i}
                onMouseEnter={() => setTooltip({ ...d, x0, y0, w, h })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={x0} y={y0} width={w} height={h}
                  fill="#f0ebe3"
                  stroke="white"
                  strokeWidth={1}
                />
                <rect
                  x={x0} y={forestY}
                  width={w} height={forestHeight}
                  fill="#15bc9d"
                  opacity={0.2}
                />
                {trees.map((t, j) => (
                  <TreeIcon
                    key={j}
                    x={t.x} y={t.y}
                    size={TREE_SIZE}
                    opacity={0.85}
                  />
                ))}
                {w > 60 && h > 30 && (
                  <text
                    x={x0 + w / 2}
                    y={y0 + Math.min(14, h / 2)}
                    textAnchor="middle"
                    fontSize={Math.min(10, w / 5)}
                    fontFamily="var(--mono)"
                    fill="#2c2c2c"
                    fontWeight={600}
                  >
                    {d.country}
                  </text>
                )}
                {w > 60 && h > 45 && (
                  <text
                    x={x0 + w / 2}
                    y={y0 + Math.min(24, h / 2) + 10}
                    textAnchor="middle"
                    fontSize={Math.min(9, w / 6)}
                    fontFamily="var(--mono)"
                    fill="#555"
                  >
                    {d.forestPct}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Tooltip inside SVG */}
          {tooltip && (() => {
            const TW = 180;
            const TH = 56;
            const tx = Math.max(4, Math.min(
              tooltip.x0 + tooltip.w / 2 - TW / 2,
              CONTAINER_WIDTH - TW - 4
            ));
            const ty = tooltip.y0 - TH - 8 < 0
              ? tooltip.y0 + tooltip.h + 8
              : tooltip.y0 - TH - 8;
            return (
              <g transform={`translate(${tx}, ${ty})`}>
                <rect x={0} y={0} width={TW} height={TH}
                  fill="white" stroke="#e2e1dc" rx={4}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                <text x={10} y={18} fontSize={14} fontWeight={600} fill="#2c2c2c">
                  {tooltip.country}
                </text>
                <text x={10} y={34} fontSize={12} fill="#888">
                  {tooltip.area.toLocaleString()} km²
                </text>
                <text x={10} y={48} fontSize={12} fill="#888">
                  {tooltip.forestPct}% forest coverage
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend — outside SVG, below the chart */}
      <div style={{
        display: "flex",
        gap: 20,
        justifyContent: "center",
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text-muted)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 14, height: 14,
            background: "#f0ebe3",
            border: "1px solid #ccc",
            borderRadius: 2,
            flexShrink: 0,
          }} />
          Non-forested land
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 14, height: 14,
            background: "#2d6a4f",
            borderRadius: 2,
            flexShrink: 0,
          }} />
          Forest coverage
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Rectangle size = country area (km²)
        </div>
      </div>

    </div>
  );
}