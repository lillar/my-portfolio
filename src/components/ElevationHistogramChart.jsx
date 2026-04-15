import { useState } from "react";
import { elevationBands, summary } from "../data/elevationData";

const COLOR_BELOW  = "#15bc9d";  // teal
const COLOR_ATRISK = "#f97316";  // orange
const COLOR_SAFE   = "#ffc600";  // ochre

// ── Zone definitions ──────────────────────────────────────
const zones = [
  {
    id: "below",
    label: "Below sea level",
    fromM: -7, toM: 0,
    color: COLOR_BELOW,
    pct: elevationBands.filter(b => b.to <= 0).reduce((s, b) => s + b.pct, 0),
    risk: "Flooded instantly if dikes fail",
  },
  {
    id: "atrisk",
    label: "0m – 5m",
    fromM: 0, toM: 5,
    color: COLOR_ATRISK,
    pct: elevationBands.filter(b => b.from >= 0 && b.to <= 5).reduce((s, b) => s + b.pct, 0),
    risk: "Above sea level but inside dike rings — at risk from dike breach or river surge",
  },
  {
    id: "safe",
    label: "5m – 323m",
    fromM: 5, toM: 323,
    color: COLOR_SAFE,
    pct: elevationBands.filter(b => b.from >= 5).reduce((s, b) => s + b.pct, 0),
    risk: "Relatively safe — natural drainage, outside dike zones",
  },
];

// ── Layout ────────────────────────────────────────────────
const width  = 480;
const height = 480;
const margin = { top: 10, right: 160, bottom: 20, left: 56 };
const innerW = width  - margin.left - margin.right;
const innerH = height - margin.top  - margin.bottom;

// ── Y: sqrt-compressed so all 3 zones are readable ────────
// Height ∝ sqrt(metre range) — compresses the 317m safe zone
// so −7→0m (7m) and 0→5m (5m) are visible
const sqrtM  = (m) => Math.sqrt(Math.abs(m));
const totalS = sqrtM(7) + sqrtM(5) + sqrtM(318);
const zoneH  = {
  below:  sqrtM(7)   / totalS * innerH,
  atrisk: sqrtM(5)   / totalS * innerH,
  safe:   sqrtM(318) / totalS * innerH,
};

// Y pixel boundaries (SVG top = high elevation)
const Y = {
  top:    margin.top,
  atrisk: margin.top + zoneH.safe,                   // 5m line
  below:  margin.top + zoneH.safe + zoneH.atrisk,    // 0m = sea level
  bottom: margin.top + innerH,
};

// ── X: width derived so that width × height ∝ km² ────────
// width = pct / zoneH → width × zoneH = pct = land area
// Normalise so the largest ratio fills innerW
const rawZoneW = (z) => z.pct / zoneH[z.id];
const maxRaw   = Math.max(...zones.map(rawZoneW));
const zoneW    = (z) => (rawZoneW(z) / maxRaw) * innerW;

// ── Y axis: elevation → pixel ─────────────────────────────
function elevToY(elev) {
  if (elev >= 5)  return Y.top    + zoneH.safe   * (1 - (elev - 5)   / (323 - 5));
  if (elev >= 0)  return Y.atrisk + zoneH.atrisk * (1 - elev / 5);
  return                 Y.below  + zoneH.below  * (1 - (elev + 7) / 7);
}

// ── Text wrapping helper ──────────────────────────────────
function splitText(text, maxChars = 28) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  words.forEach(word => {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  });
  if (current) lines.push(current);
  return lines;
}

export default function ElevationChart() {

  return (
    <div style={{ width: "100%", position: "relative", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Zone rectangles ── */}
        {[
          { zone: "safe",   y: Y.top,    h: zoneH.safe   },
          { zone: "atrisk", y: Y.atrisk, h: zoneH.atrisk },
          { zone: "below",  y: Y.below,  h: zoneH.below  },
        ].map(({ zone, y, h }) => {
          const z   = zones.find(z => z.id === zone);
          const w   = zoneW(z);

          return (
            <g key={zone}
              style={{ cursor: "default" }}>

              {/* Rectangle — area ∝ km² of land */}
              <rect
                x={margin.left} y={y + 1}
                width={w} height={h - 2}
                fill={z.color}
                fillOpacity={0.95}
              />

              {/* % label — inside if bar wide enough, outside if not */}
              {(() => {
                const labelW = z.pct >= 10 ? 36 : 28; // estimated label width in px
                const inside = w > labelW + 12;
                return (
                  <text
                    x={inside ? margin.left + w - 8 : margin.left + w + 8}
                    y={inside ? y + h / 2 : y + h / 2 - 28}
                    textAnchor={inside ? "end" : "start"}
                    dominantBaseline="middle"
                    fontSize={h > 40 ? 14 : 10}
                    fontFamily="var(--mono)" fontWeight={700}
                    fill={inside ? "var(--bg)" : z.color}
                    pointerEvents="none">
                    {z.pct.toFixed(1)}%
                  </text>
                );
              })()}

              {/* Right-side: zone label + risk description */}
              <text
                x={margin.left + w + 10}
                y={y + h / 2 - (h > 30 ? 8 : 4)}
                fontSize={10} fontFamily="var(--mono)"
                fontWeight={700} fill={z.color}>
                {z.label}
              </text>
              {splitText(z.risk).map((line, i) => (
                <text key={i}
                  x={margin.left + w + 10}
                  y={y + h / 2 + (h > 30 ? 4 : 6) + i * 10}
                  fontSize={9} fontFamily="var(--mono)"
                  fill="var(--text-muted)">
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── Y axis line ── */}
        <line
          x1={margin.left} x2={margin.left}
          y1={Y.top} y2={Y.bottom}
          stroke="var(--border)" strokeWidth={0.8}
        />

        {/* ── Sea level line ── */}
        <line
          x1={margin.left - 10}
          x2={margin.left + zoneW(zones.find(z => z.id === "atrisk"))}
          y1={Y.below} y2={Y.below}
          stroke="var(--text)" strokeWidth={1.5}
        />

        {/* ── Y axis ticks ── */}
        {[
          { elev: 322, label: "+322m", bold: true },
          { elev: 5,   label: "+5m",   bold: true  },
          { elev: 0,   label: "0m",    bold: true  },
          { elev: -7,  label: "−7m",   bold: true  },
        ].map(({ elev, label, bold }) => {
          const y = elevToY(elev);
          return (
            <g key={elev}>
              <line
                x1={margin.left - 5} x2={margin.left}
                y1={y} y2={y}
                stroke={bold ? "var(--text)" : "var(--border)"}
                strokeWidth={bold ? 1.2 : 0.6}
              />
              <text
                x={margin.left - 8} y={y}
                textAnchor="end" dominantBaseline="middle"
                fontSize={bold ? 9 : 7.5} fontFamily="var(--mono)"
                fontWeight={bold ? 700 : 400}
                fill={bold ? "var(--text)" : "var(--text-muted)"}>
                {label}
              </text>
            </g>
          );
        })}

        {/* ── "sea level" text ── */}
        <text
          x={margin.left - 8} y={Y.below - 8}
          textAnchor="end" fontSize={9}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          Sea level
        </text>

        {/* ── Scale break indicator ── */}
        <text
          x={margin.left - 8} y={(Y.top + Y.atrisk) / 2}
          textAnchor="end" fontSize={9}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          ≈
        </text>

        {/* ── Y axis label ── */}
        <text
          transform={`translate(10, ${Y.top + innerH / 2}) rotate(-90)`}
          textAnchor="middle" fontSize={9}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          Elevation (m)
        </text>

      </svg>
    </div>
  );
}