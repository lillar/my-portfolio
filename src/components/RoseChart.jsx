import { useState, useMemo } from "react";
import * as d3 from "d3";
import { hourlyData, seasons } from "../data/electricityData";

const width = 500;
const height = 500;
const cx = width / 2;
const cy = height / 2;

const R_INNER = 48;   // center hole
const R_OUTER = 200;  // max radius

// One slice per hour = 360/24 = 15°
const SLICE_ANGLE = (2 * Math.PI) / 24;
// Small gap between slices
const GAP = 0.04; // radians

const MIN_VAL = 190; // scale floor (below min to give center meaning)
const MAX_VAL = 400; // scale ceiling

const rScale = d3.scaleLinear()
  .domain([MIN_VAL, MAX_VAL])
  .range([R_INNER, R_OUTER]);

const STACK_ORDER = ["winter", "autumn", "summer", "spring"];

// Angle: 0° = top (midnight), clockwise
function hourAngle(hour) {
  return (hour / 24) * 2 * Math.PI - Math.PI / 2;
}

function buildSlicePath(hour, value, innerR = R_INNER) {
  const startAngle = hourAngle(hour) + GAP / 2;
  const endAngle = hourAngle(hour) + SLICE_ANGLE - GAP / 2;
  const outerR = rScale(value);

  const x1 = cx + innerR * Math.cos(startAngle);
  const y1 = cy + innerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(startAngle);
  const y2 = cy + outerR * Math.sin(startAngle);
  const x3 = cx + outerR * Math.cos(endAngle);
  const y3 = cy + outerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(endAngle);
  const y4 = cy + innerR * Math.sin(endAngle);

  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `L ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 0 1 ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `L ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 0 0 ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    "Z",
  ].join(" ");
}

const HOUR_LABELS = [
  "00", "01", "02", "03", "04", "05",
  "06", "07", "08", "09", "10", "11",
  "12", "13", "14", "15", "16", "17",
  "18", "19", "20", "21", "22", "23",
];

export default function RoseChart() {
  const [activeSeason, setActiveSeason] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const handleMouseEnter = (e, hour, season, value) => {
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      hour: HOUR_LABELS[hour] + ":00",
      season,
      value,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Ref circles for scale
  const refValues = [350, 400];

  return (
    <div style={{ width: "100%", position: "relative", fontFamily: "var(--mono)" }}>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block", overflow: "visible" }}>

        {/* Reference rings */}
        {refValues.map((val) => (
          <g key={val}>
            <circle cx={cx} cy={cy} r={rScale(val)}
              fill="none" stroke="var(--border)"
              strokeWidth={0.5} strokeDasharray="3 3" />
            <text
              x={cx + rScale(val) + 3} y={cy}
              fontSize={9} fill="var(--text-muted)"
              dominantBaseline="middle">
              {val}GW
            </text>
          </g>
        ))}

        {/* Hour spoke lines */}
        {HOUR_LABELS.map((_, h) => {
          const angle = hourAngle(h);
          return (
            <line key={h}
              x1={cx + R_INNER * Math.cos(angle)}
              y1={cy + R_INNER * Math.sin(angle)}
              x2={cx + (R_OUTER + 4) * Math.cos(angle)}
              y2={cy + (R_OUTER + 4) * Math.sin(angle)}
              stroke="var(--border)" strokeWidth={0.3}
            />
          );
        })}

        {/* Hour labels — every 3 hours */}
        {HOUR_LABELS.map((label, h) => {
          if (h % 3 !== 0) return null;
          const angle = hourAngle(h) + SLICE_ANGLE / 2;
          const r = R_OUTER + 18;
          return (
            <text key={h}
              x={cx + r * Math.cos(angle)}
              y={cy + r * Math.sin(angle)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontWeight={600} fill="var(--text-muted)">
              {label}:00
            </text>
          );
        })}

        {/* Season slices — render inactive first, then active on top */}

        {[...seasons]
        .sort((a, b) => {
            if (a.key === activeSeason) return 1;
            if (b.key === activeSeason) return -1;
            return STACK_ORDER.indexOf(a.key) - STACK_ORDER.indexOf(b.key);
        })
        .map((season) => {
          const isActive = activeSeason === null || activeSeason === season.key;
          return (
            <g key={season.key} opacity={isActive ? 1 : 0.15}
              style={{ transition: "opacity 0.2s" }}>
              {hourlyData.map((d) => (
                <path
                  key={d.hour}
                  d={buildSlicePath(d.hour, d[season.key])}
                  fill={season.color}
                  fillOpacity={1}
                  stroke="var(--bg)"
                  strokeWidth={0.5}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    setActiveSeason(season.key);
                    handleMouseEnter(e, d.hour, season.label, d[season.key]);
                  }}
                  onMouseLeave={() => {
                    setActiveSeason(null);
                    setTooltip(null);
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 8} textAnchor="middle"
          fontSize={9} fill="var(--text-muted)">EU-27</text>
        <text x={cx} y={cy + 6} textAnchor="middle"
          fontSize={9} fill="var(--text-muted)">electricity</text>
        <text x={cx} y={cy + 18} textAnchor="middle"
          fontSize={9} fill="var(--text-muted)">demand</text>

      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 12,
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
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {tooltip.season} · {tooltip.hour}
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            {tooltip.value} GW avg load
          </div>
        </div>
      )}

      {/* Season legend */}
      <div style={{
        display: "flex", gap: 16, justifyContent: "center",
        marginTop: 8, fontSize: 10, color: "var(--text-muted)",
        flexWrap: "wrap",
      }}>
        {seasons.map((s) => (
          <div key={s.key}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              cursor: "pointer",
              opacity: activeSeason === null || activeSeason === s.key ? 1 : 0.4,
            }}
            onMouseEnter={() => setActiveSeason(s.key)}
            onMouseLeave={() => setActiveSeason(null)}
          >
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: s.color, opacity: 0.85,
            }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}