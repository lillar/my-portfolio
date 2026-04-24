import { useState } from "react";
import * as d3 from "d3";
import { ageGroups, riskIndexNote, facts } from "../data/accidentData";

// ── Colors ────────────────────────────────────────────────
const COLOR_KM     = "#5800FF";  // purple  — km cycled
const COLOR_INJURY = "#b904ca";  // magenta — injury share
const COLOR_RISK   = "#15bc9d";  // teal    — risk index
const COLOR_HL     = "#ffc600";  // ochre   — highlight both 65+ age groups

// ── Layout ────────────────────────────────────────────────
const VW = 560;
const VH = 560;

const PAD   = 12;  // gap between panels
const pM    = { top: 72, right: 8, bottom: 44, left: 12 };
const panelW = (VW - PAD * 4) / 3;
const innerW = panelW - pM.left - pM.right;
const innerH = VH - pM.top - pM.bottom;

// ── Shared X scale ────────────────────────────────────────
const xScale = d3.scaleBand()
  .domain(ageGroups.map(d => d.age))
  .range([0, innerW])
  .padding(0.28);

const bx = d => xScale(d.age);
const bw = xScale.bandwidth();
const mx = d => bx(d) + bw / 2;

// ── Per-panel Y scales ────────────────────────────────────
const yKm     = d3.scaleLinear().domain([0, 36]).range([innerH, 0]);
const yInjury = d3.scaleLinear().domain([0, 26]).range([innerH, 0]);
const yRisk   = d3.scaleLinear().domain([0, 700]).range([innerH, 0]);

// ── Highlight: BOTH 65+ age groups ───────────────────────
const isHighlighted = d => d.age === "65–74" || d.age === "75+";

// ── Panel definitions ─────────────────────────────────────
const panels = [
  {
    id: "km",
    color: COLOR_KM,
    title: "On the bike",
    subtitle: "km per person per week",
    yScale: yKm,
    value: d => d.kmPerWeek,
    highlight: d => d.age === "65–74",
    annotation: {
      age: "65–74",
      lines: ["65–74 & 75+ cycle", "as much as or more", "than working adults"],
      dy: -12,
    },
    yTicks: [0, 10, 20, 30],
  },
  {
    id: "injury",
    color: COLOR_INJURY,
    title: "Share of accidents",
    subtitle: "% of all serious injuries",
    yScale: yInjury,
    value: d => d.injuryShare,
    highlight: d => d.age === "75+",
    annotation: {
      age: "75+",
      lines: ["65+ are 25% of population,", "but 42% of serious", "cycling injuries"],
      dy: -12,
    },
    yTicks: [0, 5, 10, 15, 20, 25],
  },
  {
    id: "risk",
    color: COLOR_RISK,
    title: "Risk per km",
    subtitle: "index: 12–17 yr = 100",
    yScale: yRisk,
    value: d => d.riskIndex,
    highlight: d => d.age === "75+",
    annotation: {
      age: "75+",
      lines: ["65+ face 3–6× higher", "risk per km than", "younger cyclists"],
      dy: -12,
    },
    yTicks: [0, 200, 400, 600],
  },
];

// ── Panel X offsets ───────────────────────────────────────
const panelX = (i) => PAD + i * (panelW + PAD);

export default function AccidentChart() {
  const [hovered, setHovered] = useState(null);
  const [showNote, setShowNote] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {panels.map((p, pi) => {
          const ox = panelX(pi) + pM.left;
          const oy = pM.top;

          return (
            <g key={p.id} transform={`translate(${ox}, ${oy})`}>

              {/* ── Panel title ── */}
              <text x={innerW / 10} y={-48}
                textAnchor="start" fontSize={11}
                fontFamily="var(--mono)" fontWeight={700}
                fill="var(--text)">
                {p.title}
              </text>
              <text x={innerW / 10} y={-34}
                textAnchor="start" fontSize={10}
                fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {p.subtitle}
              </text>

              {/* Step number */}
              <circle cx={-pM.left + 10} cy={-44} r={9}
                fill={p.color} fillOpacity={0.15}
                stroke={p.color} strokeWidth={1} />
              <text x={-pM.left + 10} y={-44}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fontFamily="var(--mono)"
                fontWeight={700} fill={p.color}>
                {pi + 1}
              </text>

              {/* ── Gridlines ── */}
              {p.yTicks.map(t => (
                <line key={t}
                  x1={0} x2={innerW}
                  y1={p.yScale(t)} y2={p.yScale(t)}
                  stroke="var(--border)"
                  strokeWidth={t === 0 ? 0.8 : 0.35}
                  strokeDasharray={t === 0 ? "none" : "3 3"} />
              ))}

              {/* ── Bars — highlight both 65+ groups ── */}
              {ageGroups.map(d => {
                const isHL  = isHighlighted(d);  // both 65-74 AND 75+
                const isHov = hovered === d.age;
                const barH  = innerH - p.yScale(p.value(d));
                const fill  = isHL ? COLOR_HL : p.color;

                return (
                  <g key={d.age}
                    onMouseEnter={() => setHovered(d.age)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}>
                    <rect
                      x={bx(d)} y={p.yScale(p.value(d))}
                      width={bw} height={barH}
                      fill={fill}
                      fillOpacity={
                        isHov ? 1 :
                        hovered && !isHov ? 0.25 :
                        isHL ? 0.9 : 0.72
                      }
                      rx={2} />
                  </g>
                );
              })}

              {/* ── Annotation ── */}
              {(() => {
                const ann = p.annotation;
                const d   = ageGroups.find(g => g.age === ann.age);
                const ax  = mx(d)/2-10;
                const ay  = p.yScale(p.value(d))-2 + ann.dy;
                return (
                  <g pointerEvents="none">
                    {ann.lines.map((line, li) => (
                      <text key={li}
                        x={ax} y={ay - (ann.lines.length - 1 - li) * 11}
                        textAnchor="start" fontSize={9}
                        fontFamily="var(--mono)"
                        fill={p.highlight(d) ? "#222" : p.color}
                        fontWeight={400}>
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })()}

              {/* ── Y axis ── */}
              <line x1={0} x2={0} y1={0} y2={innerH}
                stroke="var(--border)" strokeWidth={0.8} />
              {p.yTicks.map(t => (
                <g key={t}>
                  <line x1={-3} x2={0} y1={p.yScale(t)} y2={p.yScale(t)}
                    stroke="var(--border)" strokeWidth={0.8} />
                  <text x={-6} y={p.yScale(t)}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={9} fontFamily="var(--mono)"
                    fill="var(--text-muted)">
                    {t}{pi === 0 ? "" : pi === 1 ? "%" : ""}
                  </text>
                </g>
              ))}

              {/* ── X axis labels ── */}
              <line x1={0} x2={innerW} y1={innerH} y2={innerH}
                stroke="var(--border)" strokeWidth={0.8} />
              {ageGroups.map(d => (
                <text key={d.age}
                  transform={`rotate(-90, ${mx(d)}, ${innerH + 8})`}
                  x={mx(d)-8} y={innerH + 12}
                  textAnchor="middle" fontSize={9}
                  fontFamily="var(--mono)"
                  fill={hovered === d.age ? "var(--text)" : "var(--text-muted)"}>
                  {d.age}
                </text>
              ))}

              {/* ── Hover value label ── */}
              {hovered && (() => {
                const d = ageGroups.find(g => g.age === hovered);
                if (!d) return null;
                return (
                  <text
                    x={mx(d)} y={p.yScale(p.value(d)) - 5}
                    textAnchor="middle" fontSize={8}
                    fontFamily="var(--mono)" fontWeight={700}
                    fill={p.color} pointerEvents="none">
                    {p.value(d)}{pi === 1 ? "%" : ""}
                  </text>
                );
              })()}

              {/* ── Risk index "?" button (panel 3 only) ── */}
              {pi === 2 && (
                <g transform={`translate(${innerW + 4}, -44)`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setShowNote(true)}
                  onMouseLeave={() => setShowNote(false)}>
                  <circle cx={6} cy={0} r={7}
                    fill={"#222222"} fillOpacity={0.15}
                    stroke={"#222222"} strokeWidth={0.8} />
                  <text x={6} y={0}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={8} fontFamily="var(--mono)"
                    fill={"#222"} fontWeight={700}>
                    ?
                  </text>
                </g>
              )}

            </g>
          );
        })}

        {/* ── Risk index explainer — floats on hover ── */}
        {showNote && (
          <g transform={`translate(${VW - 440}, ${pM.top - 8})`}>
            <rect x={0} y={0} width={440} height={76}
              rx={5} fill="var(--bg)"
              stroke={COLOR_RISK} strokeWidth={1} />
            <text x={8} y={13}
              fontSize={10} fontFamily="var(--mono)"
              fontWeight={700} fill={COLOR_RISK}>
              Risk index = injuries per bn km
            </text>
            {riskIndexNote.slice(0, 3).map((line, i) => (
              <text key={i} x={8} y={28 + i * 16}
                fontSize={9} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                · {line}
              </text>
            ))}
          </g>
        )}

        {/* ── Bottom note ── */}
        <text x={VW / 2} y={VH + 6}
          textAnchor="middle" fontSize={9}
          fontFamily="var(--mono)" fill="var(--text-muted)"
          opacity={0.8}>
          Highlighted bars = age groups referenced in annotations · hover any bar to compare across panels
        </text>

      </svg>
    </div>
  );
}