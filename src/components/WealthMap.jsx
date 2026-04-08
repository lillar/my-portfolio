import { useState } from "react";
import * as d3 from "d3";
import { wealthData } from "../data/wealthData";

const TILE = 28;
const GAP = 3;
const STEP = TILE + GAP;
const RADIUS = 3;

// Normalise col/row so grid starts at 0,0 — removes empty gaps
const minCol = d3.min(wealthData, (d) => d.col);
const minRow = d3.min(wealthData, (d) => d.row);
const maxCol = d3.max(wealthData, (d) => d.col) - minCol;
const maxRow = d3.max(wealthData, (d) => d.row) - minRow;

const colorScale = d3.scaleSequential()
  .domain([
    d3.min(wealthData, (d) => d.mean / d.median),
    d3.max(wealthData, (d) => d.mean / d.median),
  ])
  .interpolator(d3.interpolateRgbBasis(["#5800FF", "#b904ca", "#ffc600"]));

function rampPath(median, mean, w, h) {
  const pad = 4;
  const x0 = pad, x1 = w - pad;
  const base = h - pad;
  const maxH = h - pad * 2;
  const leftH = (median / mean) * maxH;
  return [
    `M ${x0} ${base}`,
    `L ${x1} ${base}`,
    `L ${x1} ${base - maxH}`,
    `L ${x0} ${base - leftH}`,
    "Z",
  ].join(" ");
}

const CHART_W = (maxCol + 1) * STEP;
const CHART_H = (maxRow + 1) * STEP;

// Legend column — shape legend (square = TILE×TILE) + color bar
const LEG_SHAPE_H = TILE;           // square, same as chart tile
const LEG_SHAPE_W = TILE;
const LEG_BAR_W   = 10;
const LEG_LABEL_PAD = 10;           // space for labels above/below

// Vertical layout of legend items (top-anchored to match chart top)
const SHAPE_X     = (LEG_BAR_W - LEG_SHAPE_W) / 2;
const SHAPE_Y     = LEG_LABEL_PAD;                       // ramp square top
const MEDIAN_Y    = SHAPE_Y + LEG_SHAPE_H + 10;          // "median" label below square
const BAR_GAP     = 18;                                   // gap before color bar
const BAR_Y       = MEDIAN_Y + BAR_GAP;                   // color bar top
const BAR_H       = CHART_H - BAR_Y - LEG_LABEL_PAD;     // fills to bottom

const LEG_W       = Math.max(LEG_SHAPE_W, LEG_BAR_W) + 4;
const GAP_BETWEEN = 14;
const SVG_W       = LEG_W + GAP_BETWEEN + CHART_W;
const SVG_H       = CHART_H;

export default function WealthMap() {
  const [tooltip, setTooltip] = useState(null);
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (e, d) => {
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setHovered(d.iso2);
    setTooltip({
      country: d.country,
      median: d.median,
      mean: d.mean,
      ratio: (d.mean / d.median).toFixed(2),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => { setHovered(null); setTooltip(null); };

  const chartX = LEG_W + GAP_BETWEEN;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "var(--mono)" }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          {/* Bottom = purple (more equal), top = yellow (less equal) */}
          <linearGradient id="wealthGradV" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#5800FF" />
            <stop offset="50%"  stopColor="#b904ca" />
            <stop offset="100%" stopColor="#ffc600" />
          </linearGradient>
        </defs>

        {/* ── LEFT LEGEND ── */}

        {/* "mean →" above top-right of square */}
        <text x={SHAPE_X + LEG_SHAPE_W} y={SHAPE_Y - 2}
          textAnchor="end" fontSize={7} fontFamily="var(--mono)" fill="var(--text-muted)">
          mean →
        </text>

        {/* Shape legend — square, same size as chart tile */}
        <rect x={SHAPE_X} y={SHAPE_Y} width={LEG_SHAPE_W} height={LEG_SHAPE_H}
          rx={RADIUS} fill="var(--bg)" stroke="var(--border)" strokeWidth={0.5} />
        <path
          d={rampPath(0.5, 1, LEG_SHAPE_W, LEG_SHAPE_H)}
          transform={`translate(${SHAPE_X}, ${SHAPE_Y})`}
          fill="var(--border)" fillOpacity={0.7}
        />

        {/* "← median" below bottom-left of square */}
        <text x={SHAPE_X} y={MEDIAN_Y}
          textAnchor="start" fontSize={7} fontFamily="var(--mono)" fill="var(--text-muted)">
          ← median
        </text>

        {/* "less equal" above color bar */}
        <text x={LEG_BAR_W / 2} y={BAR_Y - 3}
          textAnchor="middle" fontSize={6.5} fontFamily="var(--mono)" fill="var(--text-muted)">
          less equal
        </text>

        {/* Color bar */}
        <rect x={0} y={BAR_Y} width={LEG_BAR_W} height={BAR_H}
          rx={4} fill="url(#wealthGradV)" />

        {/* "more equal" below color bar */}
        <text x={LEG_BAR_W / 2} y={BAR_Y + BAR_H + 9}
          textAnchor="middle" fontSize={6.5} fontFamily="var(--mono)" fill="var(--text-muted)">
          more equal
        </text>

        {/* ── CHART TILES ── */}
        <g transform={`translate(${chartX}, 0)`}>
          {wealthData.map((d) => (
            <rect
              key={`bg-${d.iso2}`}
              x={(d.col - minCol) * STEP}
              y={(d.row - minRow) * STEP}
              width={TILE} height={TILE} rx={RADIUS}
              fill="var(--border)" fillOpacity={0.2}
            />
          ))}

          {wealthData.map((d) => {
            const x = (d.col - minCol) * STEP;
            const y = (d.row - minRow) * STEP;
            const color = colorScale(d.mean / d.median);
            const isHovered = hovered === d.iso2;
            return (
              <g key={d.iso2}
                onMouseEnter={(e) => handleMouseEnter(e, d)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}>
                <rect x={x} y={y} width={TILE} height={TILE} rx={RADIUS}
                  fill="var(--bg)"
                  stroke={isHovered ? "var(--text)" : "var(--border)"}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                />
                <g transform={`translate(${x}, ${y})`}>
                  <path
                    d={rampPath(d.median, d.mean, TILE, TILE)}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : 0.78}
                  />
                </g>
                <text
                  x={x + TILE / 2} y={y + TILE / 2}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={7} fontFamily="var(--mono)" fontWeight={600}
                  fill="var(--text)" fillOpacity={isHovered ? 1 : 0.75}
                >
                  {d.iso2}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x > SVG_W * 0.65 ? tooltip.x - 155 : tooltip.x + 12,
          top: tooltip.y > SVG_H * 0.65 ? tooltip.y - 60 : tooltip.y,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 4, padding: "6px 10px",
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text)", pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.country}</div>
          <div style={{ color: "var(--text-muted)" }}>Median: €{tooltip.median.toFixed(0)}k</div>
          <div style={{ color: "var(--text-muted)" }}>Mean:   €{tooltip.mean.toFixed(0)}k</div>
          <div style={{ color: "var(--text-muted)", marginTop: 2 }}>Ratio: {tooltip.ratio}×</div>
        </div>
      )}
    </div>
  );
}