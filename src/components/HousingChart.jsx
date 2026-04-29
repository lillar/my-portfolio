import * as d3 from "d3";
import { countries, bands, years } from "../data/housingData";

// ── Layout ────────────────────────────────────────────────
const VW   = 560;
const VH   = 600;
const COLS = 2;
const ROWS = 2;
const HGAP = 8;
const VGAP = 10;

const TITLE_H = 32;
const pM = { top: 44, right: 6, bottom: 30, left: 34 };

const panelW = (VW - HGAP * (COLS + 1)) / COLS;
const panelH = (VH - TITLE_H - VGAP * (ROWS + 1)) / ROWS;
const innerW = panelW - pM.left - pM.right;
const innerH = panelH - pM.top  - pM.bottom;

const panelX = ci => HGAP + (ci % COLS) * (panelW + HGAP);
const panelY = ci => TITLE_H + VGAP + Math.floor(ci / COLS) * (panelH + VGAP);

// Y axis label center
const allTop = TITLE_H + VGAP + pM.top;
const allBot = TITLE_H + VGAP * 3 + panelH * 2 - pM.bottom;
const yLabelMidY = (allTop + allBot) / 2;

const xTicks = [2006, 2014, 2022];

// ── Scales ────────────────────────────────────────────────
const xScale = d3.scaleLinear().domain([2004, 2024]).range([0, innerW]);
const yScale = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

// ── Area generator — linear ───────────────────────────────
const makeArea = (y0fn, y1fn) =>
  d3.area()
    .x(d => xScale(d.year))
    .y0(d => yScale(y0fn(d)))
    .y1(d => yScale(y1fn(d)));

// Build stacked cumulative pcts: [cum0, cum1, cum2, cum3, cum4, cum5]
// cum0 = 0 (baseline), cum5 = 100
function buildStack(data) {
  return data.map(d => {
    const cumul = [0];
    d.pcts.forEach(p => cumul.push(cumul[cumul.length - 1] + p));
    // Clamp top to exactly 100 (rounding errors)
    cumul[5] = 100;
    return { year: d.year, cumul };
  });
}

export default function HousingChart() {
  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >

        {/* ── Title ── */}
        <text x={VW / 2} y={14}
          textAnchor="middle" fontSize={14}
          fontFamily="var(--mono)" fontWeight={700}
          fill="var(--text)">
          Housing affordability across major markets, 2004–2024
        </text>

        {/* ── Legend ── */}
        {(() => {
          const spacing = 14;
          const itemWidths = bands.map(b => 12 + 4 + b.label.length * 6.5);
          const totalW = itemWidths.reduce((s, w) => s + w, 0) + spacing * (bands.length - 1);
          let cx = VW / 2 - totalW / 2;
          return (
            <g transform="translate(0, 20)">
              <text x={VW / 2 - totalW / 2 + 36} y={8}
                textAnchor="end" fontSize={11}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                median multiple:
              </text>
              {bands.map((b, i) => {
                const x = cx;
                cx += itemWidths[i] + spacing;
                return (
                  <g key={b.id} transform={`translate(${x}, 0)`}>
                    <rect x={38} y={0} width={12} height={10} rx={2}
                      fill={b.color} fillOpacity={0.85} />
                    <text x={54} y={8} fontSize={11}
                      fontFamily="var(--mono)" fill="var(--text-muted)">
                      {b.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* ── Panels ── */}
        {countries.map((country, ci) => {
          const ox      = panelX(ci) + pM.left;
          const oy      = panelY(ci) + pM.top;
          const stacked = buildStack(country.data);
          const isLeft  = ci % COLS === 0;

          // Area functions for each of 5 bands
          const areaFns = bands.map((_, bi) =>
            makeArea(
              d => d.cumul[bi],
              d => d.cumul[bi + 1]
            )
          );

          // Latest year data point
          const last = country.data[country.data.length - 1];
          const lastPcts = last.pcts;

          return (
            <g key={country.id} transform={`translate(${ox}, ${oy})`}>

              {/* Country label */}
              <text x={innerW / 2} y={-30}
                textAnchor="middle" fontSize={13}
                fontFamily="var(--mono)" fontWeight={700}
                fill="var(--text)">
                {country.label}
              </text>

              {/* Markets note */}
              <text x={innerW / 2} y={-18}
                textAnchor="middle" fontSize={10}
                fontFamily="var(--mono)" fill="var(--text-muted)">
                {country.markets}
              </text>

              {/* 2024 snapshot: % impossible + severe */}
              {(() => {
                const imp = lastPcts[4];
                const sev = lastPcts[3];
                // Color by the LOWEST band that still has any markets
                const color = "#f97316";
                return (
                  <text x={innerW / 2} y={-6}
                    textAnchor="middle" fontSize={11}
                    fontFamily="var(--mono)"
                    fill="var(--text-muted)">
                    {"2024: "}
                    <tspan fill={color} fontWeight={700}>
                      {(imp + sev).toFixed(0)}% severely or worse
                    </tspan>
                  </text>
                );
              })()}

              {/* Clip */}
              <clipPath id={`clip-${country.id}`}>
                <rect x={0} y={0} width={innerW} height={innerH} />
              </clipPath>

              {/* Stacked areas */}
              <g clipPath={`url(#clip-${country.id})`}>
                {areaFns.map((area, bi) => (
                  <path key={bi}
                    d={area(stacked)}
                    fill={bands[bi].color}
                    fillOpacity={0.82}
                  />
                ))}
              </g>

              {/* Y axis — left panels only */}
              <line x1={0} x2={0} y1={0} y2={innerH}
                stroke="var(--border)" strokeWidth={0.8} />
              {isLeft && [0, 25, 50, 75, 100].map(t => (
                <g key={t}>
                  <line x1={-4} x2={0} y1={yScale(t)} y2={yScale(t)}
                    stroke="var(--border)" strokeWidth={0.6} />
                  <text x={-6} y={yScale(t)}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={11} fontFamily="var(--mono)"
                    fill="var(--text-muted)">
                    {t === 0 ? "" : `${t}%`}
                  </text>
                </g>
              ))}

              {/* ── Pandemic marker ── */}
              <line
                x1={xScale(2020)} x2={xScale(2020)}
                y1={0} y2={innerH}
                stroke="var(--text)" strokeWidth={1}
                strokeOpacity={0.7}
              />
              <text
                x={xScale(2020) + 3} y={10}
                fontSize={9} fontFamily="var(--mono)"
                fill="var(--text)" opacity={0.7}>
                COVID-19
              </text>

              {/* X axis */}
              <line x1={0} x2={innerW} y1={innerH} y2={innerH}
                stroke="var(--border)" strokeWidth={0.8} />
              {xTicks.map(t => (
                <g key={t}>
                  <line x1={xScale(t)} x2={xScale(t)}
                    y1={innerH} y2={innerH + 4}
                    stroke="var(--border)" strokeWidth={0.6} />
                  <text x={xScale(t)} y={innerH + 17}
                    textAnchor="middle" fontSize={11}
                    fontFamily="var(--mono)" fill="var(--text-muted)">
                    {t}
                  </text>
                </g>
              ))}

            </g>
          );
        })}

        {/* ── Y axis label ── */}
        <text
          transform={`translate(7, ${yLabelMidY}) rotate(-90)`}
          textAnchor="middle" fontSize={11}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          % of major markets by affordability tier
        </text>


      </svg>
    </div>
  );
}