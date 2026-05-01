import { useState, useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { countries, countryData } from "../data/obesityData";

// ── Config ────────────────────────────────────────────────
const YEARS      = ["2000", "2022"];
const AGE_GROUPS = ["5-9", "10-14", "15-19"];

const AGE_COLORS = {
  "5-9":   "#15bc9d",
  "10-14": "#5800FF",
  "15-19": "#b904ca",
};

const COLOR_HL = "#f97316";

// ── Layout ────────────────────────────────────────────────
const VW     = 500;
const VH     = 500;
const margin = { top: 64, right: 16, bottom: 62, left: 40 };
const innerW = VW - margin.left - margin.right;
const innerH = VH - margin.top  - margin.bottom;

const YEAR_GAP = 24;
const SLOT_PAD = 0.18;
const GROUP_W  = (innerW - YEAR_GAP) / 2;
const VIOLIN_W = GROUP_W / AGE_GROUPS.length * (1 - SLOT_PAD * 0.5);

function slotCX(yearIdx, agIdx) {
  const slotW = GROUP_W / AGE_GROUPS.length;
  return yearIdx * (GROUP_W + YEAR_GAP) + agIdx * slotW + slotW / 2;
}

const yScale = d3.scaleLinear().domain([0, 20]).range([innerH, 0]);

function kde(kernel, thresholds, data) {
  return thresholds.map(x => [x, d3.mean(data, v => kernel(x - v))]);
}
function epanechnikov(bw) {
  return v => Math.abs(v /= bw) <= 1 ? 0.75 * (1 - v * v) / bw : 0;
}
function buildViolin(vals, cx, halfW) {
  const density    = kde(epanechnikov(2.2), d3.range(0, 20.2, 0.2), vals);
  const maxDensity = d3.max(density, d => d[1]);
  const scale      = maxDensity > 0 ? (halfW - 2) / maxDensity : 0;
  const right = density.map(([y, d]) => [cx + d * scale, yScale(y)]);
  const left  = [...density].reverse().map(([y, d]) => [cx - d * scale, yScale(y)]);
  return "M" + [...right, ...left].map(p => p.join(",")).join("L") + "Z";
}

export default function ObesityChart() {
  const [selected,   setSelected]   = useState("All");
  const [hovered,    setHovered]    = useState(null); // { type:"dot"|"median", country?, year, ag, v, cx, cy }
  const [menuOpen,   setMenuOpen]   = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const violinData = useMemo(() => {
    const result = {};
    YEARS.forEach((year, yi) => {
      result[year] = {};
      AGE_GROUPS.forEach((ag, ai) => {
        const cx    = slotCX(yi, ai);
        const halfW = VIOLIN_W / 2;
        const vals  = countries.map(c => countryData[c]?.[year]?.[ag]).filter(v => v != null);
        result[year][ag] = {
          cx, halfW, vals,
          path:   buildViolin(vals, cx, halfW),
          median: d3.median(vals),
        };
      });
    });
    return result;
  }, []);

  // ── Tooltip renderer (shared for dot + median) ──────────
  function Tooltip() {
    if (!hovered) return null;
    const { type, country, year, ag, v, cx, cy } = hovered;
    const color = AGE_COLORS[ag];
    const TW = 124, TH = type === "median" ? 50 : 38, TR = 4;
    const tx  = Math.min(Math.max(cx - TW / 2, 2), innerW - TW - 2);
    const ty  = cy - TH - 10;
    return (
      <g pointerEvents="none">
        <rect x={tx} y={ty} width={TW} height={TH} rx={TR}
          fill="var(--bg)" stroke="var(--border)" strokeWidth={1}
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }} />
        {type === "dot" ? (
          <>
            <text x={tx + TW / 2} y={ty + 12}
              textAnchor="middle" fontSize={10}
              fontFamily="var(--mono)" fontWeight={700} fill="var(--text)">
              {country}
            </text>
            <text x={tx + TW / 2} y={ty + 26}
              textAnchor="middle" fontSize={9}
              fontFamily="var(--mono)" fill="var(--text-muted)">
              {`age ${ag} · ${v}%`}
            </text>
          </>
        ) : (
          <>
            <text x={tx + TW / 2} y={ty + 12}
              textAnchor="middle" fontSize={9}
              fontFamily="var(--mono)" fontWeight={700} fill={color}>
              {`${ag} yrs — ${year}`}
            </text>
            <text x={tx + TW / 2} y={ty + 26}
              textAnchor="middle" fontSize={9}
              fontFamily="var(--mono)" fill="var(--text-muted)">
              median: {v.toFixed(1)}%
            </text>
            <text x={tx + TW / 2} y={ty + 39}
              textAnchor="middle" fontSize={8}
              fontFamily="var(--mono)" fill="var(--text-muted)">
              across {countries.length} EU countries
            </text>
          </>
        )}
        {/* Caret pointing down to target */}
        <polygon
          points={`${cx - 5},${cy - 10} ${cx + 5},${cy - 10} ${cx},${cy - 4}`}
          fill="var(--bg)" stroke="var(--border)" strokeWidth={1} />
      </g>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "var(--mono)", position: "relative" }}>

      {/* ── Country selector ── */}
      <div ref={menuRef} style={{ position: "absolute", top: 6, right: 16, zIndex: 20 }}>
        <button onClick={() => setMenuOpen(o => !o)} title="Highlight a country"
          style={{
            width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 4,
            background: menuOpen ? "var(--text)" : "transparent",
            color: menuOpen ? "var(--bg)" : "var(--text-muted)",
            cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>☰</button>

        {menuOpen && (
          <div style={{
            position: "absolute", top: 30, right: 0, background: "var(--bg)",
            border: "1px solid var(--border)", borderRadius: 6,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            minWidth: 160, maxHeight: 260, overflowY: "auto",
            padding: "4px 0", zIndex: 30,
          }}>
            {["All", ...countries].map(c => (
              <div key={c} onClick={() => { setSelected(c); setMenuOpen(false); }}
                style={{
                  padding: "5px 12px", fontFamily: "var(--mono)", fontSize: 11,
                  cursor: "pointer",
                  background: selected === c ? "var(--tag-bg)" : "transparent",
                  color: selected === c ? "var(--text)" : "var(--text-muted)",
                  fontWeight: selected === c ? 600 : 400,
                }}>
                {c === "All" ? "All countries" : c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Selected country pill ── */}
      {selected !== "All" && (
        <div style={{
          position: "absolute", top: 6, right: 48, zIndex: 20,
          display: "flex", alignItems: "center", gap: 4,
          background: "var(--tag-bg)", borderRadius: 4, padding: "2px 8px",
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--text)",
        }}>
          {selected}
          <span onClick={() => setSelected("All")}
            style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: 12 }}>×</span>
        </div>
      )}

      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>

        {/* ── Title ── */}
        <text x={margin.left} y={16} textAnchor="start" fontSize={14}
          fontFamily="var(--mono)" fontWeight={700} fill="var(--text)">
          Child &amp; adolescent obesity in the EU
        </text>
        <text x={margin.left} y={40} textAnchor="start" fontSize={11}
          fontFamily="var(--mono)" fill="var(--text-muted)">
          % with BMI-for-age &gt; +2SD · 27 EU countries · each dot = one country
        </text>

        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* ── Gridlines ── */}
          {[0, 5, 10, 15, 20].map(t => (
            <line key={t} x1={0} x2={innerW} y1={yScale(t)} y2={yScale(t)}
              stroke="var(--border)"
              strokeWidth={t === 0 ? 0.8 : 0.35}
              strokeDasharray={t === 0 ? "none" : "3 3"} />
          ))}

          {/* ── Year group backgrounds ── */}
          {YEARS.map((year, yi) => (
            <rect key={year}
              x={yi * (GROUP_W + YEAR_GAP)} y={0}
              width={GROUP_W} height={innerH}
              fill="var(--bg-card)" fillOpacity={0.4} rx={4} />
          ))}

          {/* ── Violins + dots + median ── */}
          {YEARS.map((year, yi) =>
            AGE_GROUPS.map((ag, ai) => {
              const color = AGE_COLORS[ag];
              const { cx, halfW, path, median } = violinData[year][ag];
              const medY  = yScale(median);
              const isMedianHov = hovered?.type === "median" && hovered?.year === year && hovered?.ag === ag;

              return (
                <g key={`${year}-${ag}`}>

                  {/* Violin */}
                  <path d={path} fill={color} fillOpacity={0.15}
                    stroke={color} strokeWidth={1.2} strokeOpacity={0.7} />

                  {/* Median — invisible wide hit area */}
                  <line x1={cx - halfW * 0.8} x2={cx + halfW * 0.8}
                    y1={medY} y2={medY}
                    stroke="transparent" strokeWidth={10}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered({ type: "median", year, ag, v: median, cx, cy: medY })}
                    onMouseLeave={() => setHovered(null)} />

                  {/* Median — visible colored line */}
                  <line x1={cx - halfW * 0.55} x2={cx + halfW * 0.55}
                    y1={medY} y2={medY}
                    stroke={color}
                    strokeWidth={isMedianHov ? 5 : 4}
                    strokeLinecap="round"
                    pointerEvents="none" />

                  {/* Dots — one per country */}
                  {countries.map(country => {
                    const v        = countryData[country]?.[year]?.[ag];
                    if (v == null) return null;
                    const isHL     = selected === country;
                    const isHov    = hovered?.type === "dot" && hovered?.country === country && hovered?.year === year && hovered?.ag === ag;
                    const isDimmed = selected !== "All" && !isHL;
                    const dotCY    = yScale(v);

                    return (
                      <g key={country}
                        onMouseEnter={() => setHovered({ type: "dot", country, year, ag, v, cx, cy: dotCY })}
                        onMouseLeave={() => setHovered(null)}
                        style={{ cursor: "pointer" }}>
                        {(isHL || isHov) && (
                          <circle cx={cx} cy={dotCY} r={6.5} fill="var(--bg)" />
                        )}
                        <circle cx={cx} cy={dotCY}
                          r={isHL || isHov ? 4.5 : 3}
                          fill={isHL ? COLOR_HL : isHov ? "var(--text)" : color}
                          fillOpacity={isDimmed ? 0.08 : (isHL || isHov) ? 1 : 0.65} />
                      </g>
                    );
                  })}
                </g>
              );
            })
          )}

          {/* ── Tooltip (rendered last so it sits on top) ── */}
          <Tooltip />

          {/* ── X axis ── */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />

          {/* Age group labels */}
          {YEARS.map((year, yi) =>
            AGE_GROUPS.map((ag, ai) => (
              <text key={`${year}-${ag}-label`}
                x={slotCX(yi, ai)} y={innerH + 14}
                textAnchor="middle" fontSize={9}
                fontFamily="var(--mono)" fill={AGE_COLORS[ag]}>
                {ag}
              </text>
            ))
          )}

          {/* Year labels */}
          {YEARS.map((year, yi) => {
            const groupCX = yi * (GROUP_W + YEAR_GAP) + GROUP_W / 2;
            return (
              <g key={`${year}-ylabel`}>
                <line
                  x1={yi * (GROUP_W + YEAR_GAP) + 4}
                  x2={yi * (GROUP_W + YEAR_GAP) + GROUP_W - 4}
                  y1={innerH + 28} y2={innerH + 28}
                  stroke="var(--border)" strokeWidth={0.8} />
                <text x={groupCX} y={innerH + 42}
                  textAnchor="middle" fontSize={11}
                  fontFamily="var(--mono)" fontWeight={700} fill="var(--text)">
                  {year}
                </text>
              </g>
            );
          })}

          {/* ── Y axis ── */}
          <line x1={0} x2={0} y1={0} y2={innerH}
            stroke="var(--border)" strokeWidth={0.8} />
          {[0, 5, 10, 15, 20].map(t => (
            <g key={t}>
              <line x1={-4} x2={0} y1={yScale(t)} y2={yScale(t)}
                stroke="var(--border)" strokeWidth={0.6} />
              <text x={-7} y={yScale(t)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={9} fontFamily="var(--mono)" fill="var(--text-muted)">
                {t === 0 ? "" : `${t}%`}
              </text>
            </g>
          ))}
          <text transform={`translate(-30, ${innerH / 2}) rotate(-90)`}
            textAnchor="middle" fontSize={9}
            fontFamily="var(--mono)" fill="var(--text-muted)">
            obesity prevalence (%)
          </text>

        </g>

        {/* ── Legend ── */}
        <g transform={`translate(${margin.left}, ${VH})`}>
          <line x1={0} x2={14} y1={0} y2={0}
            stroke="black" strokeWidth={3} strokeLinecap="round" />
          <text x={20} y={1} dominantBaseline="middle"
            fontSize={11} fontFamily="var(--mono)" fill="var(--text-muted)">
            median
          </text>
          <circle cx={78} cy={0} r={6} fill="var(--text-muted)" fillOpacity={0.4} />
          <text x={88} y={1} dominantBaseline="middle"
            fontSize={11} fontFamily="var(--mono)" fill="var(--text-muted)">
            country · use ☰ to highlight
          </text>
        </g>

      </svg>
    </div>
  );
}