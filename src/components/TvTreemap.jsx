import * as d3 from "d3";
import { useState, useMemo } from "react";
import { tvViewingDataTop10 } from "../data/tvViewingData";

const colors = {
  Asia:     { dark: "#b904ca", light: "#e87af5" },
  Africa:   { dark: "#15bc9d", light: "#7de8d4" },
  Europe:   { dark: "#5800FF", light: "#a066ff" },
  Americas: { dark: "#595959", light: "#a8a8a8" },
  Oceania:  { dark: "#ffc600", light: "#ffe080" },
};

const CONTAINER_WIDTH = 700;
const CONTAINER_HEIGHT = 600;

export default function TvPictogram() {
  const [tooltip, setTooltip] = useState(null);

  // ── Regional averages ──────────────────────────────────
  const regionalAvg = useMemo(() => {
    const continents = [...new Set(tvViewingDataTop10.map((d) => d.continent))];
    const avg = {};
    continents.forEach((c) => {
      const withData = tvViewingDataTop10.filter(
        (d) => d.continent === c && d.minutes !== null
      );
      avg[c] = d3.mean(withData, (d) => d.minutes);
    });
    return avg;
  }, []);

  // ── Build continent hierarchy ──────────────────────────
  const treemapNodes = useMemo(() => {
    const continents = [...new Set(tvViewingDataTop10.map((d) => d.continent))];

    const hierarchyData = {
      name: "world",
      children: continents.map((c) => ({
        name: c,
        children: tvViewingDataTop10.filter((d) => d.continent === c),
      })),
    };

    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => d.population || 0);

    d3.treemap()
      .size([CONTAINER_WIDTH, CONTAINER_HEIGHT])
      .paddingOuter(0)   // gap between continents
      .paddingInner(0) // gap between countries
      .paddingTop(0)    // room for continent label
      (root);

    return root;
  }, []);

  const getColor = (d) => {
    if (d.minutes === null) return null;
    const avg = regionalAvg[d.continent];
    const shade = d.minutes >= avg ? "dark" : "light";
    return colors[d.continent]?.[shade] || "#999";
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${CONTAINER_WIDTH} ${CONTAINER_HEIGHT}`}
        width="100%"
        style={{ display: "block" }}
      >
        <defs>
          <pattern id="checker" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="white" />
            <rect x="3" width="3" height="3" fill="#6d6b6b" />
            <rect y="3" width="3" height="3" fill="#6d6b6b" />
            <rect x="3" y="3" width="3" height="3" fill="white" />
          </pattern>
        </defs>



        {/* Country rects */}
        {treemapNodes.leaves().map((node, i) => {
          const d = node.data;
          const fill = getColor(d);
          const w = node.x1 - node.x0;
          const h = node.y1 - node.y0;
          return (
            <rect
              key={i}
              x={node.x0}
              y={node.y0}
              width={w}
              height={h}
              fill={fill || "url(#checker)"}
              stroke= "var(--bg)"
              strokeWidth={0.5}
              onMouseEnter={() =>
                setTooltip({ ...d, x: node.x0, y: node.y0, w, h })
              }
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}

        {/* Tooltip */}
        {tooltip && (() => {
          const TW = 220;  // tooltip width
          const TH = 72;   // tooltip height

          // flip horizontally if too close to right edge
          const tx = tooltip.x + tooltip.w / 2 + TW > CONTAINER_WIDTH
            ? tooltip.x + tooltip.w / 2 - TW  // show left of cursor
            : tooltip.x + tooltip.w / 2;      // show right of cursor

          // flip vertically if too close to top edge
          const ty = tooltip.y - TH - 8 < 0
            ? tooltip.y + tooltip.h + 8       // show below rect
            : tooltip.y - TH - 8;            // show above rect

          return (
            <g transform={`translate(${tx}, ${ty})`}>
              <rect x={0} y={0} width={TW} height={TH}
                fill="white" stroke="#e2e1dc" rx={4}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
              <text x={10} y={22} fontSize={16} fontWeight={600} fill="#2c2c2c">
                {tooltip.country}
              </text>
              <text x={10} y={42} fontSize={14} fill="#888">
                {tooltip.continent} · {tooltip.population}M people
              </text>
              <text x={10} y={60} fontSize={14} fill="#888">
                {tooltip.minutes
                  ? `${tooltip.minutes} min/day ${tooltip.minutes >= regionalAvg[tooltip.continent] ? "↑ above" : "↓ below"} avg`
                  : "no data"}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16,
        marginTop: 16, justifyContent: "center",
        fontFamily: "var(--mono)", fontSize: 11,
      }}>
        {Object.entries(colors).map(([continent, { dark, light }]) => (
          <div key={continent} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ color: "var(--text-muted)" }}>{continent}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 14, height: 14, background: dark, borderRadius: 2 }} title="above regional avg" />
              <div style={{ width: 14, height: 14, background: light, borderRadius: 2 }} title="below regional avg" />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ color: "var(--text-muted)" }}>No data</span>
          <div style={{
            width: 14, height: 14, borderRadius: 2,
            background: "repeating-conic-gradient(#6d6b6b 0% 25%, white 0% 50%) 0 0 / 6px 6px",
          }} />
        </div>
      </div>
    </div>
  );
}