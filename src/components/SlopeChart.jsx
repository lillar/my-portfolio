import * as d3 from "d3";
import { useState, useMemo, useRef, useEffect } from "react";
import { wageVsCostData } from "../data/wageVsCostData";

const COLOR_ABOVE = "#15bc9d";
const COLOR_BELOW = "#b904ca";

// ── Fix 2: hamburger aligns with legend strip ──────────────
const LEGEND_W = 28;       // left strip width for legend + hamburger


// ── Fix 3: push LEFT_COL right so wage labels don't overlap Y ticks ──
const width = 460;
const height = 500;        // Fix 2: fixed at 500

const margin = { top: 48, right: 130, bottom: 16, left: LEGEND_W + 80 };
const LEFT_COL = margin.left;          // left dots (minWage)
const RIGHT_COL = width - margin.right; // right dots (costOfLiving)
const innerHeight = height - margin.top - margin.bottom;

const MIN_GAP = 11;

function resolveCollisions(posMap) {
  const keys = Object.keys(posMap).sort((a, b) => posMap[a] - posMap[b]);
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1];
    const curr = keys[i];
    const overlap = posMap[prev] + MIN_GAP - posMap[curr];
    if (overlap > 0) posMap[curr] += overlap;
  }
  return posMap;
}

// ── Fix 5: group right labels by costOfLiving value ───────
// Returns label string: first country alphabetically + "[...]" if multiple
// Unless a specific country is selected — then show that country
function getRightLabel(costOfLiving, selected) {
  const matches = wageVsCostData
    .filter((d) => d.costOfLiving === costOfLiving)
    .map((d) => d.country)
    .sort();

  if (selected !== "All") {
    const isMatch = matches.includes(selected);
    if (isMatch) return selected;
    // not selected country — return default collapsed label
    if (matches.length === 1) return matches[0];
    return `${matches[0]} [...]`;
  }

  if (matches.length === 1) return matches[0];
  return `${matches[0]} [...]`;
}

export default function SlopeChart() {
  const [selected, setSelected] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showTooltip = (e, country) => {
    const d = wageVsCostData.find((x) => x.country === country);
    const rect = e.currentTarget.closest("div").getBoundingClientRect();
    setTooltip({
      country: d.country,
      minWage: d.minWage,
      costOfLiving: d.costOfLiving,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const hideTooltip = () => setTooltip(null);

  const maxVal = d3.max(wageVsCostData, (d) => Math.max(d.minWage, d.costOfLiving));

  // ── Fix 4: 250 EUR tick intervals ─────────────────────────
  const yMax = Math.ceil(maxVal / 250) * 250;
  const yScale = useMemo(() =>
    d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]),
  [yMax]);

  const ticks = d3.range(0, yMax + 1, 250);

  const isHighlighted = (d) => selected === "All" || d.country === selected;

  const leftPositions = useMemo(() => {
    const pos = {};
    wageVsCostData.forEach((d) => { pos[d.country] = yScale(d.minWage); });
    return resolveCollisions(pos);
  }, [yScale]);

  // ── Fix 5: deduplicate right labels by costOfLiving value ─
  // Only render one label per unique costOfLiving value
  const renderedRightValues = new Set();

  const legendMid = margin.top + innerHeight / 2;
  const legendGap = 70;

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Fix 1+2: Hamburger in legend strip, top-aligned ── */}
      <div ref={menuRef} style={{
        position: "absolute",
        top: 4,
        left: LEGEND_W / 2 - 13, // centered in legend strip
        zIndex: 20,
      }}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          title="Find your country"
          style={{
            width: 26, height: 26,
            border: "1px solid var(--border)",
            borderRadius: 4,
            background: menuOpen ? "var(--text)" : "transparent",
            color: menuOpen ? "var(--bg)" : "var(--text-muted)",
            cursor: "pointer",
            fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >☰</button>

        {/* Dropdown panel */}
        {menuOpen && (
          <div style={{
            position: "absolute",
            top: 30, left: 0,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            minWidth: 170,
            maxHeight: 260,
            overflowY: "auto",
            padding: "4px 0",
            zIndex: 30,
          }}>
            {["All", ...wageVsCostData.map((d) => d.country).sort()].map((c) => (
              <div key={c}
                onClick={() => { setSelected(c); setMenuOpen(false); }}
                style={{
                  padding: "5px 12px",
                  fontFamily: "var(--mono)", fontSize: 11,
                  cursor: "pointer",
                  background: selected === c ? "var(--tag-bg)" : "transparent",
                  color: selected === c ? "var(--text)" : "var(--text-muted)",
                  fontWeight: selected === c ? 600 : 400,
                }}
              >
                {c === "All" ? "All countries" : c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected country pill */}
      {selected !== "All" && (
        <div style={{
          position: "absolute",
          top: 0, left: `${((LEFT_COL + RIGHT_COL) / 2 / width) * 100}%`,
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex", alignItems: "center", gap: 4,
          background: "var(--tag-bg)", borderRadius: 4,
          padding: "2px 8px",
          fontFamily: "var(--mono)", fontSize: 10,
          color: "var(--text)",
        }}>
          {selected}
          <span onClick={() => setSelected("All")}
            style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: 12 }}>×</span>
        </div>
      )}

      {/* ── SVG chart ── */}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block", overflow: "visible" }}>

        {/* ── Fix 1: legend — dot BEFORE text, vertical, inside SVG ── */}
        {/* "wage covers costs" — upper */}
        <g transform={`translate(${LEGEND_W / 2}, ${legendMid - legendGap}) rotate(-90)`}>
          <circle cx={-60} cy={0} r={4} fill={COLOR_ABOVE} />
          <text
            x={0} y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontFamily="var(--mono)"
            fill="var(--text-muted)"
          >
            wage covers costs
          </text>
        </g>

        {/* "costs exceed wage" — lower */}
        <g transform={`translate(${LEGEND_W / 2}, ${legendMid + legendGap}) rotate(-90)`}>
          <circle cx={-60} cy={0} r={4} fill={COLOR_BELOW} />
          <text
            x={0} y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontFamily="var(--mono)"
            fill="var(--text-muted)"
          >
            costs exceed wage
          </text>
        </g>

        {/* Separator between legend strip and chart */}
        <line
          x1={LEGEND_W + 2} y1={margin.top + 30}
          x2={LEGEND_W + 2} y2={margin.top + innerHeight}
          stroke="var(--border)" strokeWidth={0.5}
        />

        <g transform={`translate(0, ${margin.top})`}>

          {/* Y grid + tick labels */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={LEFT_COL - 20} x2={RIGHT_COL}
                y1={yScale(tick)} y2={yScale(tick)}
                stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 4"
              />
              <text
                x={LEFT_COL - 28} y={yScale(tick)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={9} fontFamily="var(--mono)" fill="var(--text-muted)"
              >
                €{tick}
              </text>
            </g>
          ))}

          {/* Column headers */}
          <text x={LEFT_COL} y={-24} textAnchor="middle"
            fontSize={11} fontFamily="var(--mono)" fontWeight={600} fill="var(--text)">
            Min. Wage
          </text>
          <text x={RIGHT_COL} y={-24} textAnchor="middle"
            fontSize={11} fontFamily="var(--mono)" fontWeight={600} fill="var(--text)">
            Cost of Living
          </text>

          {/* Slope lines */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            return (
              <line key={d.country}
                x1={LEFT_COL} y1={yScale(d.minWage)}
                x2={RIGHT_COL} y2={yScale(d.costOfLiving)}
                stroke={color}
                strokeWidth={highlight ? 2 : 0.8}
                strokeOpacity={highlight ? 0.9 : 0.15}
                onMouseEnter={(e) => { showTooltip(e, d.country); setSelected(d.country); }}
                onMouseLeave={() => { hideTooltip(); setSelected("All"); }}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Left dots */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            const isSelected = selected === d.country;

            return (
              <g key={`left-${d.country}`} opacity={highlight ? 1 : 0.2}>
                <circle cx={LEFT_COL} cy={yScale(d.minWage)} r={3} fill={color} 
                onMouseEnter={(e) => { showTooltip(e, d.country); setSelected(d.country); }}
                onMouseLeave={() => { hideTooltip(); setSelected("All"); }}
                  style={{ cursor: "pointer" }}/>
                {isSelected && (
                  <text
                    x={LEFT_COL+10} 
                    y={yScale(d.minWage) - 10}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={11}
                    fontFamily="var(--mono)"
                    fontWeight={400}
                    fill={color}
                  >
                    €{d.minWage}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Fix 5: Right dots + deduplicated labels ── */}
          {wageVsCostData.map((d) => {
            const highlight = isHighlighted(d);
            const color = d.minWage >= d.costOfLiving ? COLOR_ABOVE : COLOR_BELOW;
            const labelY = yScale(d.costOfLiving);;

            // Determine if this country should render the right label
            const sameValueCountries = wageVsCostData
              .filter((x) => x.costOfLiving === d.costOfLiving)
              .map((x) => x.country)
              .sort();

            const isFirstAlpha = sameValueCountries[0] === d.country;
            const isSelected = selected === d.country;

            // Render label only for: first alphabetically, OR selected country
            const shouldRenderLabel =
                (isSelected) ||
                (d.costOfLiving % 100 !== 50 &&  // skip x50 values
                isFirstAlpha && !renderedRightValues.has(d.costOfLiving));

            if (shouldRenderLabel && !isSelected) {
              renderedRightValues.add(d.costOfLiving);
            }

            const label = getRightLabel(d.costOfLiving, selected);

            return (
              <g key={`right-${d.country}`} opacity={highlight ? 1 : 0.2}>
                <circle cx={RIGHT_COL} cy={yScale(d.costOfLiving)} r={3} fill={color} 
                  onMouseEnter={(e) => { showTooltip(e, d.country); setSelected(d.country); }}
                  onMouseLeave={() => { hideTooltip(); setSelected("All"); }}
                  style={{ cursor: "pointer" }}/>
                {shouldRenderLabel && (
                  <text
                    x={RIGHT_COL + 9} y={labelY}
                    dominantBaseline="middle"
                    fontSize={highlight ? 11 : 9}
                    fontFamily="var(--mono)"
                    fontWeight={highlight ? 400 : 200}
                    fill={highlight ? color : "var(--text-muted)"}
                  >
                    €{d.costOfLiving} {label}
                  </text>
                )}
              </g>
            );
          })}

        </g>
      </svg>
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 12,
          top: tooltip.y - 12,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "6px 10px",
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--text)",
          pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50,
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.country}</div>
          <div style={{ color: "var(--text-muted)" }}>Min. Wage: €{tooltip.minWage}</div>
          <div style={{ color: "var(--text-muted)" }}>Cost of Living: €{tooltip.costOfLiving}</div>
        </div>
      )}
    </div>
  );
}