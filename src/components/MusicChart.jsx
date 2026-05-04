import { useMemo } from "react";
import * as d3 from "d3";
import { data, formats } from "../data/musicData";

// ── Layout ────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;
const margin = { top: 50, right: 16, bottom: 56, left: 16 };
const innerW = VW - margin.left - margin.right;
const innerH = VH - margin.top  - margin.bottom;

// ── Stacking config ───────────────────────────────────────
// Each ribbon's thickness in pixels = share% × SHARE_TO_PX
// Tuned so the largest ribbon (CD at 95% in 2002) fits comfortably
const SHARE_TO_PX = 2.5;          // px per percentage point
const GAP_PX      = 12;           // gap between adjacent ribbons
const HAIRLINE_PX = 2;            // visible thickness for dead ribbons
// stack heights vary per year — center the stack vertically each year

// ── Scales ────────────────────────────────────────────────
const xScale = d3.scaleLinear()
  .domain([1973, 2023])
  .range([0, innerW]);

// ── Pre-compute first appearance index for tie-breaking ───
function firstAppearanceIdx(formatId) {
  for (let i = 0; i < data.length; i++) if (data[i][formatId] > 0) return i;
  return Infinity;
}
const APPEARANCE = {};
formats.forEach(f => { APPEARANCE[f.id] = firstAppearanceIdx(f.id); });

// ── For each year: compute each format's [yTop, yBot] ─────
// Sort ascending by share (smallest at top, largest at bottom — like the reference)
// Tie-break: later-appearing format goes innermost (top)
function buildYearStack() {
  return data.map(d => {
    const sorted = formats
      .map(f => ({ id: f.id, share: d[f.id] }))
      .sort((a, b) => {
        if (a.share !== b.share) return b.share - a.share;  // DESC
        // Tie-break: later-appearing format ends up at the bottom
        return APPEARANCE[a.id] - APPEARANCE[b.id];
      });

    const thicknesses = sorted.map(({ share }) =>
      share === 0 ? HAIRLINE_PX : share * SHARE_TO_PX
    );
    const totalT = thicknesses.reduce((s, t) => s + t, 0);
    const totalG = (sorted.length - 1) * GAP_PX;
    const stackH = totalT + totalG;

    // Anchor stack to bottom of inner area — ribbons grow upward as they grow
    let y = innerH - stackH;
    const result = {};
    sorted.forEach(({ id }, i) => {
      result[id] = { yTop: y, yBot: y + thicknesses[i] };
      y += thicknesses[i] + GAP_PX;
    });
    return { year: d.year, bands: result };
  });
}

// ── Build smooth ribbon path for one format ──────────────
const smoothLine = d3.line()
  .x(d => d[0])
  .y(d => d[1])
  .curve(d3.curveBumpX);

function buildRibbonPath(yearStack, formatId) {
  // Top edge: forward through years
  const topPts = yearStack.map(y => [
    xScale(y.year),
    y.bands[formatId].yTop,
  ]);
  // Bottom edge: backward through years
  const botPts = [...yearStack].reverse().map(y => [
    xScale(y.year),
    y.bands[formatId].yBot,
  ]);

  const topPath = smoothLine(topPts);
  const botPath = smoothLine(botPts);
  // Strip leading "M..." from bottom path so we can append with a line-to
  const botNoM = botPath.replace(/^M[^,]+,[^A-Za-z]+/, "");
  return topPath + "L" + botPts[0].join(",") + botNoM + "Z";
}

// ── Label positions: at each format's peak year ──────────
function labelPos(yearStack, formatId) {
  const peakYearObj = data.reduce((best, d) =>
    d[formatId] > best[formatId] ? d : best, data[0]);
  const peakYear  = peakYearObj.year;
  const peakShare = peakYearObj[formatId];
  if (peakShare < 5) return null;
  const stackEntry = yearStack.find(y => y.year === peakYear);
  if (!stackEntry) return null;
  const { yTop, yBot } = stackEntry.bands[formatId];
  return {
    x: xScale(peakYear),
    y: (yTop + yBot) / 2,
    thickness: yBot - yTop,
  };
}

// ── X axis ticks ──────────────────────────────────────────
const xTicks = [1973, 1983, 1993, 2003, 2013, 2023];

export default function MusicChart() {
  const yearStack = useMemo(() => buildYearStack(), []);
  const ribbons   = useMemo(() =>
    formats.map(f => ({
      ...f,
      path: buildRibbonPath(yearStack, f.id),
    })),
  [yearStack]);

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Title ── */}
        <text x={margin.left} y={18}
          textAnchor="start" fontSize={14}
          fontFamily="var(--mono)" fontWeight={700}
          fill="var(--text)">
          Half a century of music formats
        </text>
        <text x={margin.left} y={34}
          textAnchor="start" fontSize={10}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          US market share by revenue · sorted by share (biggest on top)
        </text>

        {/* ── Legend ── */}
        {(() => {
          // Divide the available width into 6 equal columns.
          // Each format gets one column, so its rect and label
          // share the same center X — that's what makes them align
          // vertically as a grid rather than flowing as a single row.
          const colW = (VW - margin.left - margin.right) / formats.length;

          return formats.map((fmt, i) => {
            // Center X of this format's column
            const cx = margin.left + i * colW + colW / 2;

            // Row 1 Y: where you want the rects to sit
            const rectY = 72;
            // Row 2 Y: below the rects, for the labels
            const textY = rectY + 24;

            return (
              <g key={fmt.id}>
                {/* Rect centered on cx: shift left by half its width (5px) */}
                <rect
                  x={cx - 5} y={rectY}
                  width={10} height={10} rx={2}
                  fill={fmt.color} fillOpacity={0.88}
                />
                {/* Text centered on cx via textAnchor="middle" */}
                <text
                  x={cx} y={textY}
                  textAnchor="middle"
                  fontSize={10} fontFamily="var(--mono)"
                  fill="var(--text-muted)"
                >
                  {fmt.label.split(" ").map((word, wi) => (
                    <tspan
                      key={wi}
                      x={cx}
                      // First word: sits at textY
                      // Second word: shifts down by one line height
                      dy={wi === 0 ? 0 : 10}
                    >
                      {word}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          });
        })()}

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Year gridlines ── */}
          {xTicks.map(t => (
            <line key={t}
              x1={xScale(t)} x2={xScale(t)}
              y1={0} y2={innerH}
              stroke="var(--border)"
              strokeWidth={0.4}
              strokeDasharray="3 3" />
          ))}

          {/* ── Ribbons ── */}
          {ribbons.map(r => (
            <path key={r.id}
              d={r.path}
              fill={r.color}
              fillOpacity={0.88} />
          ))}

          {/* ── X axis ── */}
          <line x1={0} x2={innerW} y1={innerH + 6} y2={innerH + 6}
            stroke="var(--border)" strokeWidth={0.8} />
          {xTicks.map(t => (
            <g key={t}>
              <line x1={xScale(t)} x2={xScale(t)}
                y1={innerH + 6} y2={innerH + 10}
                stroke="var(--border)" strokeWidth={0.6} />
              <text x={xScale(t)} y={innerH + 22}
                textAnchor="middle" fontSize={10}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}
        </g>

      </svg>
    </div>
  );
}