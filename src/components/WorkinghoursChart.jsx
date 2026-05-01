import * as d3 from "d3";
import { data, events } from "../data/workingHoursData";

// ── Colors ────────────────────────────────────────────────
const COLOR_LINE = "#5800FF";
const COLOR_ANN  = "var(--text)";

// ── Layout ────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;
const margin = { top: 56, right: 28, bottom: 40, left: 56 };
const innerW = VW - margin.left - margin.right;  // 416
const innerH = VH - margin.top  - margin.bottom; // 404

// ── Scales ────────────────────────────────────────────────
const xScale = d3.scaleLinear().domain([1870, 2023]).range([0, innerW]);
const yScale = d3.scaleLinear().domain([1200, 3200]).range([innerH, 0]);

// ── Generators ───────────────────────────────────────────
const line = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.hours))
  .curve(d3.curveMonotoneX);

const area = d3.area()
  .x(d => xScale(d.year))
  .y0(innerH)
  .y1(d => yScale(d.hours))
  .curve(d3.curveMonotoneX);

// ── Ticks ─────────────────────────────────────────────────
const yTicks = [1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000];
const xTicks = [1870, 1895, 1920, 1945, 1970, 1995, 2020];

// ── Interpolate hours at any year ────────────────────────
function getHours(year) {
  const exact = data.find(d => d.year === year);
  if (exact) return exact.hours;
  const before = [...data].reverse().find(d => d.year < year);
  const after  = data.find(d => d.year > year);
  if (!before || !after) return null;
  const t = (year - before.year) / (after.year - before.year);
  return before.hours + t * (after.hours - before.hours);
}

// ── Per-annotation layout (hand-tuned to avoid overlap) ──
// labelTopY: y coordinate of the TOP of the label block (in inner coords)
// textAnchor: left/middle/right alignment
// dot positions: 1919@(133,162), 1930@(163,162), 1945@(204,182),
//                1960@(245,232), 1982@(305,315), 1996@(343,341), 2020@(408,360)
const annLayout = [
  // 1919 — left cluster, label high-left
  { year: 1919, labelTopY:  10, textAnchor: "start",  xOff: -40 },
  // 1930 — just right of 1919, label mid-height to avoid overlap
  { year: 1930, labelTopY: 70, textAnchor: "start", xOff:  -50 },
  // 1945 — further right, label at top
  { year: 1945, labelTopY:  10, textAnchor: "start", xOff:  0 },
  // 1960 — middle of chart, plenty of space
  { year: 1960, labelTopY: 70, textAnchor: "start", xOff:   0 },
  // 1982 — right side, dot is low (y=315), label well above
  { year: 1982, labelTopY: 130, textAnchor: "start", xOff: -10 },
  // 1996 — close to 1982, stagger lower
  { year: 1996, labelTopY: 190, textAnchor: "start", xOff:  -10 },
  // 2020 — rightmost, dot lowest (y=360)
  { year: 2020, labelTopY: 250, textAnchor: "end",   xOff:  36 },
];

export default function WorkingHoursChart() {
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
          A century and a half of fewer hours
        </text>
        <text x={margin.left} y={34}
          textAnchor="start" fontSize={10}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          Average annual working hours per worker · Netherlands · 1870–2023
        </text>

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Gridlines ── */}
          {yTicks.map(t => (
            <line key={t}
              x1={0} x2={innerW} y1={yScale(t)} y2={yScale(t)}
              stroke="var(--border)" strokeWidth={0.4} strokeDasharray="3 3" />
          ))}

          {/* ── Area + line ── */}
          <path d={area(data)} fill={COLOR_LINE} fillOpacity={0.07} />
          <path d={line(data)} fill="none"
            stroke={COLOR_LINE} strokeWidth={2.5} strokeOpacity={0.9} />

          {/* ── Annotations ── */}
          {events.map((ev, i) => {
            const h   = getHours(ev.year);
            if (h == null) return null;
            const ex  = xScale(ev.year);
            const ey  = yScale(h);
            const lay = annLayout[i];
            const lx  = ex + lay.xOff;
            const lines = [ev.label, ...ev.detail.split("\n")];
            const lineH = 13;
            const blockH = lines.length * lineH;
            const leaderEnd = lay.labelTopY + blockH + 6;

            return (
              <g key={ev.year}>
                {/* Leader line: from dot up to label bottom */}
                <line
                  x1={ex} y1={ey - 4}
                  x2={ex} y2={leaderEnd}
                  stroke={COLOR_ANN}
                  strokeWidth={0.8}
                  strokeDasharray="3 2"
                  opacity={0.3} />

                {/* Dot */}
                <circle cx={ex} cy={ey} r={4}
                  fill={COLOR_LINE}
                  stroke="var(--bg)" strokeWidth={2} />

                {/* Label lines */}
                {lines.map((ln, li) => (
                  <text key={li}
                    x={lx}
                    y={lay.labelTopY + li * lineH}
                    textAnchor={lay.textAnchor}
                    fontSize={li === 0 ? 10.5 : 9}
                    fontFamily="var(--mono)"
                    fontWeight={li === 0 ? 700 : 400}
                    fill={COLOR_ANN}
                    opacity={li === 0 ? 1 : 0.6}>
                    {ln}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── Start callout ── */}
          <text x={xScale(1870) + 6} y={yScale(3080) - 14}
            fontSize={12} fontFamily="var(--mono)"
            fontWeight={700} fill={COLOR_LINE}>
            3,080 hrs
          </text>
          <text x={xScale(1870) + 6} y={yScale(3080) - 1}
            fontSize={10} fontFamily="var(--mono)"
            fill="var(--text-muted)">
            ≈ 60 hrs/week
          </text>

          {/* ── End callout ── */}
          <text x={xScale(2023) - 6} y={yScale(1449) + 20}
            textAnchor="end" fontSize={12}
            fontFamily="var(--mono)" fontWeight={700} fill={COLOR_LINE}>
            1,449 hrs
          </text>
          <text x={xScale(2023) - 6} y={yScale(1449) + 33}
            textAnchor="end" fontSize={10}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            ≈ 28 hrs/week
          </text>

          {/* ── Y axis ── */}
          <line x1={0} x2={0} y1={0} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />
          {yTicks.map(t => (
            <g key={t}>
              <line x1={-4} x2={0} y1={yScale(t)} y2={yScale(t)}
                stroke="var(--border)" strokeWidth={0.6} />
              <text x={-8} y={yScale(t)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={10} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {t.toLocaleString()}
              </text>
            </g>
          ))}
          <text transform={`translate(-44, ${innerH / 2}) rotate(-90)`}
            textAnchor="middle" fontSize={10}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            hours per year
          </text>

          {/* ── X axis ── */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />
          {xTicks.map(t => (
            <g key={t}>
              <line x1={xScale(t)} x2={xScale(t)}
                y1={innerH} y2={innerH + 4}
                stroke="var(--border)" strokeWidth={0.6} />
              <text x={xScale(t)} y={innerH + 16}
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