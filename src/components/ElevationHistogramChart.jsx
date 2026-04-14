import { useState } from "react";
import * as d3 from "d3";
import { elevationBands, summary } from "../data/elevationData";

const COLOR_WATER = "#15bc9d";  // teal  — below sea level
const COLOR_LAND  = "#ffc600";  // ochre — above sea level

// ── Layout ────────────────────────────────────────────────
const width   = 500;
const height  = 440;
const margin  = { top: 24, right: 160, bottom: 40, left: 56 };
const innerW  = width  - margin.left - margin.right;
const innerH  = height - margin.top  - margin.bottom;

// ── Y scale: elevation in metres ─────────────────────────
// Use a linear scale but with a break: compress 50–323m range
// so the chart doesn't waste space on the rare high-elevation tail.
// We map elevation → pixel using two linear segments:
//   −7 to +50m  → 0 to innerH * 0.85   (fine detail)
//   50  to +323m → innerH * 0.85 to innerH  (compressed tail)
const BREAK_ELEV = 50;
const BREAK_PX   = innerH * 0.18; // top 18% of chart = 50–323m

function elevToY(elev) {
  if (elev >= BREAK_ELEV) {
    // 50–323 compressed into top 18%
    return margin.top + BREAK_PX * (1 - (elev - BREAK_ELEV) / (323 - BREAK_ELEV));
  } else {
    // −7 to 50: linear, bottom 82%
    return margin.top + BREAK_PX + (innerH - BREAK_PX) * (1 - (elev - (-7)) / (BREAK_ELEV - (-7)));
  }
}

const seaLevelY = elevToY(0);

// ── X scale: % of land area ───────────────────────────────
const maxPct = d3.max(elevationBands, (d) => d.pct); // ~13.2
const xScale = d3.scaleLinear()
  .domain([0, maxPct * 1.08])
  .range([0, innerW]);

// ── Y axis ticks ─────────────────────────────────────────
const yTicks = [-6, -4, -2, 0, 2, 5, 10, 20, 50, 100, 200, 322];

export default function ElevationChart() {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const handleEnter = (e, band) => {
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setHovered(band.label);
    setTooltip({
      label: band.label,
      pct: band.pct,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  const handleLeave = () => { setHovered(null); setTooltip(null); };

  return (
    <div style={{ width: "100%", position: "relative", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Background zones ── */}
        {/* Below sea level — teal tint */}
        <rect
          x={margin.left} y={seaLevelY}
          width={innerW} height={margin.top + innerH - seaLevelY}
          fill={COLOR_WATER} fillOpacity={0.06}
        />
        {/* Above sea level — ochre tint */}
        <rect
          x={margin.left} y={margin.top}
          width={innerW} height={seaLevelY - margin.top}
          fill={COLOR_LAND} fillOpacity={0.06}
        />

        {/* ── X gridlines ── */}
        {[0, 2, 4, 6, 8, 10, 12].map((t) => (
          <line key={t}
            x1={margin.left + xScale(t)} x2={margin.left + xScale(t)}
            y1={margin.top} y2={margin.top + innerH}
            stroke="var(--border)"
            strokeWidth={t === 0 ? 1 : 0.4}
            strokeDasharray={t === 0 ? "none" : "3 3"}
          />
        ))}

        {/* ── Bars ── */}
        {elevationBands.map((b) => {
          const y0    = elevToY(b.from);
          const y1    = elevToY(b.to);
          const barY  = Math.min(y0, y1);
          const barH  = Math.abs(y0 - y1);
          const barW  = xScale(b.pct);
          const color = b.to <= 0 ? COLOR_WATER : COLOR_LAND;
          const isHov = hovered === b.label;

          return (
            <rect
              key={b.label}
              x={margin.left}
              y={barY}
              width={barW}
              height={Math.max(barH - 1, 1)}
              fill={color}
              fillOpacity={isHov ? 1 : 0.78}
              stroke={isHov ? "var(--text)" : "none"}
              strokeWidth={1}
              onMouseEnter={(e) => handleEnter(e, b)}
              onMouseLeave={handleLeave}
              style={{ cursor: "crosshair" }}
            />
          );
        })}

        {/* ── Sea level line ── */}
        <line
          x1={margin.left - 8} x2={margin.left + innerW}
          y1={seaLevelY} y2={seaLevelY}
          stroke="var(--text)" strokeWidth={1.5}
        />
        <text
          x={margin.left - 10} y={seaLevelY}
          textAnchor="end" dominantBaseline="middle"
          fontSize={8} fontWeight={700}
          fontFamily="var(--mono)" fill="var(--text)">
          0m
        </text>

        {/* ── Y axis ticks ── */}
        {yTicks.map((t) => {
          const y = elevToY(t);
          if (t === 0) return null; // already drawn above
          return (
            <g key={t}>
              <line
                x1={margin.left - 4} x2={margin.left}
                y1={y} y2={y}
                stroke="var(--border)" strokeWidth={0.8}
              />
              <text
                x={margin.left - 7} y={y}
                textAnchor="end" dominantBaseline="middle"
                fontSize={7.5} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {t > 0 ? `+${t}m` : `${t}m`}
              </text>
            </g>
          );
        })}

        {/* Y axis baseline */}
        <line
          x1={margin.left} x2={margin.left}
          y1={margin.top} y2={margin.top + innerH}
          stroke="var(--border)" strokeWidth={0.8}
        />

        {/* ── X axis ── */}
        <line
          x1={margin.left} x2={margin.left + innerW}
          y1={margin.top + innerH} y2={margin.top + innerH}
          stroke="var(--border)" strokeWidth={0.8}
        />
        {[0, 2, 4, 6, 8, 10, 12].map((t) => (
          <text key={t}
            x={margin.left + xScale(t)}
            y={margin.top + innerH + 12}
            textAnchor="middle" fontSize={8}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            {t}%
          </text>
        ))}
        <text
          x={margin.left + innerW / 2}
          y={margin.top + innerH + 28}
          textAnchor="middle" fontSize={8}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          % of land area
        </text>

        {/* ── Scale break indicator ── */}
        <text
          x={margin.left - 7}
          y={margin.top + BREAK_PX}
          textAnchor="end" dominantBaseline="middle"
          fontSize={7} fontFamily="var(--mono)"
          fill="var(--text-muted)">
          ≈
        </text>

        {/* ── Right-side annotations ── */}
        {[
          { elevation: -7.0,  label: "Zuidplaspolder",  note: "lowest point in NL" },
          { elevation: -4.0,  label: "Schiphol Airport", note: "" },
          { elevation: -2.0,  label: "Amsterdam",        note: "city centre" },
          { elevation: 322.7, label: "Vaalserberg",      note: "highest point in NL" },
        ].map(({ elevation, label, note }) => {
          const y = elevToY(elevation);
          return (
            <g key={label}>
              <line
                x1={margin.left + innerW} x2={margin.left + innerW + 8}
                y1={y} y2={y}
                stroke="var(--text-muted)" strokeWidth={0.8}
              />
              <text
                x={margin.left + innerW + 11} y={y - 4}
                fontSize={8} fontFamily="var(--mono)"
                fontWeight={600} fill="var(--text)">
                {label}
              </text>
              {note && (
                <text
                  x={margin.left + innerW + 11} y={y + 6}
                  fontSize={7} fontFamily="var(--mono)"
                  fill="var(--text-muted)">
                  {note}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Summary callouts ── */}
        {/* Below sea level */}
        <text
          x={margin.left + innerW + 11}
          y={seaLevelY + (margin.top + innerH - seaLevelY) * 0.4}
          fontSize={20} fontFamily="var(--mono)" fontWeight={700}
          fill={COLOR_WATER} fillOpacity={0.9}>
          {summary.belowSeaLevel}%
        </text>
        <text
          x={margin.left + innerW + 11}
          y={seaLevelY + (margin.top + innerH - seaLevelY) * 0.4 + 14}
          fontSize={7.5} fontFamily="var(--mono)"
          fill="var(--text-muted)">
          below sea level
        </text>

        {/* Flood prone */}
        <text
          x={margin.left + innerW + 11}
          y={seaLevelY + (margin.top + innerH - seaLevelY) * 0.72}
          fontSize={20} fontFamily="var(--mono)" fontWeight={700}
          fill={COLOR_LAND} fillOpacity={0.9}>
          {summary.floodProne}%
        </text>
        <text
          x={margin.left + innerW + 11}
          y={seaLevelY + (margin.top + innerH - seaLevelY) * 0.72 + 14}
          fontSize={7.5} fontFamily="var(--mono)"
          fill="var(--text-muted)">
          flood-prone
        </text>

        {/* ── Legend ── */}
        <g transform={`translate(${margin.left}, ${height - 14})`}>
          <rect x={0} y={-5} width={10} height={10} rx={2}
            fill={COLOR_WATER} fillOpacity={0.8} />
          <text x={14} y={3} fontSize={8} fontFamily="var(--mono)"
            dominantBaseline="middle" fill="var(--text-muted)">
            below sea level
          </text>
          <rect x={110} y={-5} width={10} height={10} rx={2}
            fill={COLOR_LAND} fillOpacity={0.8} />
          <text x={124} y={3} fontSize={8} fontFamily="var(--mono)"
            dominantBaseline="middle" fill="var(--text-muted)">
            above sea level
          </text>
        </g>

      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x > width * 0.6 ? tooltip.x - 155 : tooltip.x + 12,
          top: tooltip.y - 12,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 4, padding: "6px 10px",
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text)", pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.label}</div>
          <div style={{ color: "var(--text-muted)" }}>{tooltip.pct}% of land area</div>
        </div>
      )}
    </div>
  );
}