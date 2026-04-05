import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { pressFreedomData } from "../data/pressFreedomData";

const colorScale = d3.scaleSequential()
  .domain([100, 0])
  .interpolator(d3.interpolateRgbBasis(["#15bc9d", "#5800FF", "#b904ca"]));

const TILE = 16;
const GAP = 2;
const STEP = TILE + GAP;
const RADIUS = 2.5;
const COLS = 27;
const ROWS = 18;
const SVG_W = COLS * STEP;
const SVG_H = ROWS * STEP + 20;
const GREY = "var(--border)";

// Sorted country list for dropdown (only RSF-indexed countries)
const sortedCountries = [...pressFreedomData]
  .sort((a, b) => a.country.localeCompare(b.country));

export default function PressFreedomMap() {
  const [tooltip, setTooltip] = useState(null);
  const [selected, setSelected] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isHighlighted = (d) => selected === "All" || d.iso2 === selected;

  const handleMouseEnter = (e, d) => {
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      country: d.country,
      rank: d.rank,
      score: d.score,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const selectedData = pressFreedomData.find((d) => d.iso2 === selected);

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Hamburger + selected pill ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: 6, position: "relative", zIndex: 20,
      }}>
        <div ref={menuRef} style={{ position: "relative" }}>
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
              minWidth: 200,
              maxHeight: 280,
              overflowY: "auto",
              padding: "4px 0",
              zIndex: 30,
            }}>
              {/* All option */}
              <div
                onClick={() => { setSelected("All"); setMenuOpen(false); }}
                style={{
                  padding: "5px 12px",
                  fontFamily: "var(--mono)", fontSize: 11,
                  cursor: "pointer",
                  background: selected === "All" ? "var(--tag-bg)" : "transparent",
                  color: selected === "All" ? "var(--text)" : "var(--text-muted)",
                  fontWeight: selected === "All" ? 600 : 400,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 2,
                }}
              >All countries</div>

              {/* Country list — alphabetical */}
              {sortedCountries.map((d) => (
                <div
                  key={d.iso2}
                  onClick={() => { setSelected(d.iso2); setMenuOpen(false); }}
                  style={{
                    padding: "5px 12px",
                    fontFamily: "var(--mono)", fontSize: 11,
                    cursor: "pointer",
                    background: selected === d.iso2 ? "var(--tag-bg)" : "transparent",
                    color: selected === d.iso2 ? "var(--text)" : "var(--text-muted)",
                    fontWeight: selected === d.iso2 ? 600 : 400,
                    display: "flex", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <span>{d.country}</span>
                  {d.score !== null && (
                    <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                      #{d.rank}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected country pill */}
        {selected !== "All" && selectedData && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--tag-bg)", borderRadius: 4,
            padding: "2px 8px",
            fontFamily: "var(--mono)", fontSize: 10,
            color: "var(--text)",
          }}>
            <span
              style={{
                width: 8, height: 8, borderRadius: 1.5, flexShrink: 0,
                background: selectedData.score !== null
                  ? colorScale(selectedData.score)
                  : GREY,
              }}
            />
            {selectedData.country}
            {selectedData.score !== null && (
              <span style={{ color: "var(--text-muted)" }}>
                — #{selectedData.rank} · {selectedData.score.toFixed(1)}
              </span>
            )}
            <span
              onClick={() => setSelected("All")}
              style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: 13, marginLeft: 2 }}
            >×</span>
          </div>
        )}
      </div>

      {/* ── Map SVG ── */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: "block" }}
      >
        {pressFreedomData.map((d) => {
          const x = d.col * STEP;
          const y = d.row * STEP;
          const fill = d.score !== null ? colorScale(d.score) : GREY;
          const highlighted = isHighlighted(d);
          const dimmed = selected !== "All" && !highlighted;

          return (
            <rect
              key={d.iso2}
              x={x}
              y={y}
              width={TILE}
              height={TILE}
              rx={RADIUS}
              fill={fill}
              opacity={dimmed ? 0.12 : d.score !== null ? 0.92 : 1}
              stroke={highlighted && selected !== "All" ? "var(--text)" : "none"}
              strokeWidth={highlighted && selected !== "All" ? 1.5 : 0}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => handleMouseEnter(e, d)}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
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
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text)",
          pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50,
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.country}</div>
          {tooltip.score !== null ? (
            <>
              <div style={{ color: "var(--text-muted)" }}>Rank: #{tooltip.rank} / 180</div>
              <div style={{ color: "var(--text-muted)" }}>Score: {tooltip.score.toFixed(1)} / 100</div>
            </>
          ) : (
            <div style={{ color: "var(--text-muted)" }}>Not in RSF index</div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        justifyContent: "center", marginTop: 6,
        fontFamily: "var(--mono)", fontSize: 10,
        color: "var(--text-muted)",
      }}>
        <span>Most free</span>
        <svg width={140} height={12}>
          <defs>
            <linearGradient id="pfGrad" x1="0%" x2="100%">
              <stop offset="0%"   stopColor="#15bc9d" />
              <stop offset="50%"  stopColor="#5800FF" />
              <stop offset="100%" stopColor="#b904ca" />
            </linearGradient>
          </defs>
          <rect x={0} y={2} width={140} height={8} rx={4} fill="url(#pfGrad)" />
        </svg>
        <span>Least free</span>
        <div style={{
          width: 12, height: 12, borderRadius: 2,
          background: GREY, opacity: 1, marginLeft: 8,
        }} />
        <span>No data</span>
      </div>
    </div>
  );
}