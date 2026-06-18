import { useMemo } from "react";
import * as d3 from "d3";
import { seasons, seasonalData } from "../data/precipitationData";

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;

// Left margin is wide enough to hold the season name labels.
// Right margin has room for the axis line.
const margin = { top: 108, right: 24, bottom: 48, left: 92 };

const innerW = VW - margin.left - margin.right;
const innerH = VH - margin.top  - margin.bottom;

// How much vertical space each ridge gets.
// Ridges overlap: each ridge's peak can extend up into the row above.
const rowH = innerH / seasons.length; // base spacing between ridge baselines

// How tall the tallest ridge can grow above its baseline.
// 1.6 × rowH lets ridges overlap nicely without completely obscuring each other.
const RIDGE_SCALE = 1.6;

// ─────────────────────────────────────────────────────────────────────────────
// X SCALE — shared across all ridges
//
// Maps precipitation mm → horizontal pixel position.
// Domain spans from 0 to a round number above the global max (~470 mm).
// ─────────────────────────────────────────────────────────────────────────────
const globalMax = d3.max(seasonalData, d => d.total_mm); // ~468
const xScale = d3.scaleLinear()
  .domain([0, Math.ceil(globalMax / 50) * 50]) // round up to nearest 50 → 500
  .range([0, innerW]);

// ─────────────────────────────────────────────────────────────────────────────
// KERNEL DENSITY ESTIMATION (KDE)
//
// A KDE smooths a set of data points into a continuous probability density
// curve. It works by placing a small "kernel" (bell curve) at each data
// point and summing all the kernels. The result is a smooth curve that
// shows where the data is concentrated.
//
// epanechnikovKernel(bandwidth):
//   The Epanechnikov kernel is optimal for KDE — it minimises mean squared
//   error. The formula is: k(u) = 0.75 × (1 − u²) for |u| ≤ 1, else 0.
//   bandwidth controls how wide each kernel is (= how smooth the result is).
//   Too small → spiky/noisy. Too large → oversmoothed/flat.
//
// kernelDensityEstimator(kernel, xValues):
//   For each x in xValues, computes the average kernel weight across all
//   data points. Returns an array of [x, density] pairs ready to plot.
// ─────────────────────────────────────────────────────────────────────────────
function epanechnikovKernel(bandwidth) {
  return function(x, xi) {
    const u = (x - xi) / bandwidth;
    return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) / bandwidth : 0;
  };
}

function kernelDensityEstimator(kernel, xValues) {
  return function(data) {
    // For each candidate x, average the kernel evaluated at (x − each data point)
    return xValues.map(x => [
      x,
      d3.mean(data, xi => kernel(x, xi)),
    ]);
  };
}

// Evaluation grid: 200 evenly spaced x points across the full domain.
// More points = smoother curve, but diminishing returns above ~150.
const evalPoints = d3.range(0, 501, 2.5); // [0, 2.5, 5, ... 500]

// Bandwidth of 30mm is well-suited for seasonal precipitation:
// captures the spread of a typical ±1 season range without oversmoothing.
const kde = kernelDensityEstimator(epanechnikovKernel(30), evalPoints);

// ─────────────────────────────────────────────────────────────────────────────
// RIDGE PATH BUILDER
//
// For each season:
//   1. Extract all total_mm values for that season
//   2. Run KDE → array of [x, density] pairs
//   3. Scale density values so the tallest ridge reaches RIDGE_SCALE × rowH
//   4. Build a closed SVG area path:
//        top edge  — KDE curve from left to right
//        bottom    — straight horizontal baseline back to the left
//        close     — Z
//
// The baseline for season i sits at y = (i+1) × rowH in the inner group.
// (i=0 is Winter at the top, i=3 is Autumn at the bottom.)
//
// d3.area() is perfect here: it produces a closed shape between a top line
// (y0 = baseline, y1 = baseline − scaled density) and its own mirror.
// ─────────────────────────────────────────────────────────────────────────────
function buildRidgePaths() {
  return seasons.map((season, i) => {
    // Step 1: extract values for this season
    const values = seasonalData
      .filter(d => d.season === season.id)
      .map(d => d.total_mm);

    // Step 2: KDE
    const densityPts = kde(values); // [[x, density], ...]

    // Step 3: find the peak density to normalise heights
    const maxDensity = d3.max(densityPts, d => d[1]);

    // Baseline y for this ridge (in inner-group coordinates)
    const baselineY = (i + 1) * rowH;

    // Step 4: d3.area() builds the closed path
    // x maps precipitation → pixels via xScale
    // y0 = baseline (flat bottom of the area)
    // y1 = baseline minus the scaled density height
    //      density / maxDensity → normalised 0–1
    //      × RIDGE_SCALE × rowH → pixel height above baseline
    const area = d3.area()
      .x(d => xScale(d[0]))
      .y0(baselineY)
      .y1(d => baselineY - (d[1] / maxDensity) * RIDGE_SCALE * rowH)
      .curve(d3.curveBasis); // smooth the KDE curve further

    return {
      ...season,
      path:      area(densityPts),
      baselineY,
      // Also build the top line only (for the stroke on top of the fill)
      topLine: d3.line()
        .x(d => xScale(d[0]))
        .y(d => baselineY - (d[1] / maxDensity) * RIDGE_SCALE * rowH)
        .curve(d3.curveBasis)(densityPts),
      // Mean value — shown as a vertical tick on the baseline
      mean: d3.mean(values),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// X AXIS TICKS
// ─────────────────────────────────────────────────────────────────────────────
const xTicks = [0, 100, 200, 300, 400, 500];

// ─────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PrecipitationChart() {
  // Build ridge paths once — pure computation, no side effects
  const ridges = useMemo(() => buildRidgePaths(), []);

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Title ── */}
        <text x={0} y={16}
          textAnchor="start" fontSize={14} fontWeight={700}
          fontFamily="var(--mono)" fill="var(--text)">
          When does it rain in the Netherlands?
        </text>

        {/* ── Subtitle ── */}
        <text x={0} y={32}
          textAnchor="start" fontSize={10}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          Seasonal precipitation totals · De Bilt · 1906–2024 · Source: KNMI
        </text>

        {/* ── Inner chart group ── */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Vertical gridlines at x tick positions ──
                Light dashed lines help the reader judge mm values.
                Drawn before ridges so ridges sit on top.               ── */}
          {xTicks.map(t => (
            <line key={t}
              x1={xScale(t)} x2={xScale(t)}
              y1={0} y2={innerH}
              stroke="var(--border)" strokeWidth={0.4}
              strokeDasharray="3 3" />
          ))}

          {/* ── Ridges ──
                Rendered bottom-to-top (reversed) so Winter (top ridge)
                is painted last and sits visually above Autumn.
                Each ridge has:
                  - a filled area (season color, semi-transparent)
                  - a top-edge stroke (season color, more opaque)
                  - a mean tick on the baseline
                  - the season label to the left                        ── */}
          {[...ridges].map((r, ri) => (
            <g key={r.id}>

              {/* ── Filled area — the main ridge shape ──
                    fillOpacity 0.75 lets ridges below show through
                    at overlapping regions.                              ── */}
              <path
                d={r.path}
                fill={r.color}
                fillOpacity={0.95}
              />

              {/* ── Top edge stroke ──
                    A slightly darker line traces the KDE curve on top,
                    giving the ridge a clean defined edge.               ── */}
              <path
                d={r.topLine}
                fill="none"
                stroke={r.color}
                strokeWidth={1.5}
                strokeOpacity={0.95}
              />

              {/* ── Baseline ──
                    A thin horizontal line at y = baselineY spans the
                    full inner width. Acts as the "zero" for this ridge. ── */}
              <line
                x1={0} x2={innerW}
                y1={r.baselineY + 2} y2={r.baselineY + 2}
                stroke="var(--border)" strokeWidth={0.5}
              />

            </g>
          ))}

          {/* ── Season labels — left margin ──
                One label per ridge, vertically centered on the baseline.
                Text-anchor "end" right-aligns them to the left edge (x=−10).
                Also shows the month range as a smaller second line.      ── */}
          {ridges.map(r => (
            <g key={r.id + "-label"}>
              <text
                x={-10} y={r.baselineY - 10}
                textAnchor="end" fontSize={10}
                fontFamily="var(--mono)" fontWeight={700}
                fill={r.color}>
                {r.label}
              </text>
              <text
                x={-10} y={r.baselineY + 2}
                textAnchor="end" fontSize={9}
                fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {r.months}
              </text>
                <text
                    x={-10} y={r.baselineY + 14}
                    textAnchor="end" fontSize={9}
                    fontFamily="var(--mono)" fill={"var(--text)"}
                    fillOpacity={0.9}>
                    {Math.round(r.mean)} mm (avg)
                </text>
            </g>
          ))}

          {/* ── X axis ──
                Horizontal baseline at the bottom of the inner area,
                with tick marks and mm labels below.                     ── */}
          <line
            x1={0} x2={innerW}
            y1={innerH + 20} y2={innerH + 20}
            stroke="var(--border)" strokeWidth={0.8} />

          {xTicks.map(t => (
            <g key={t}>
              <line
                x1={xScale(t)} x2={xScale(t)}
                y1={innerH + 16} y2={innerH + 20}
                stroke="var(--border)" strokeWidth={0.6} />
              <text
                x={xScale(t)} y={innerH + 34}
                textAnchor="middle" fontSize={10}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}

          {/* ── X axis unit label ── */}
          <text
            x={innerW} y={innerH + 50}
            textAnchor="end" fontSize={10}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            mm precipitation
          </text>

        </g>
      </svg>
    </div>
  );
}