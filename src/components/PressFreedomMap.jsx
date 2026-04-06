import { useState, useRef, useEffect } from "react";
import { pressFreedomData } from "../data/pressFreedomData";

const CATEGORY_COLORS = [
  "#b904ca",  // 0–40   very serious
  "#5800FF",  // 41–55  difficult
  "#a855f7",  // 56–70  problematic
  "#15bc9d",  // 71–85  satisfactory
  "#0d9e83",  // 86–100 good
];

const colorScale = (score) => {
  if (score === null) return "var(--border)";
  if (score <= 40)  return CATEGORY_COLORS[0];
  if (score <= 55)  return CATEGORY_COLORS[1];
  if (score <= 70)  return CATEGORY_COLORS[2];
  if (score <= 85)  return CATEGORY_COLORS[3];
  return CATEGORY_COLORS[4];
};

const TILE = 16;
const GAP = 2;
const STEP = TILE + GAP;
const RADIUS = 2.5;
const COLS = 27;
const ROWS = 18;
const SVG_W = COLS * STEP;
const SVG_H = ROWS * STEP;
const GREY = "var(--border)";

// Sorted country list for dropdown (only RSF-indexed countries)
const sortedCountries = [...pressFreedomData]
  .sort((a, b) => {
    if (a.rank === null && b.rank === null) return 0;
    if (a.rank === null) return 1;
    if (b.rank === null) return -1;
    return a.rank - b.rank;
  });

export default function PressFreedomMap() {
  const [tooltip, setTooltip] = useState(null);
  const [selected, setSelected] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const containerRef = useRef(null);

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
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      country: d.country,
      rank: d.rank,
      score: d.score,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const selectedData = pressFreedomData.find((d) => d.iso2 === selected);

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 600,
          fontFamily: "var(--mono)", color: "var(--text)",
          marginBottom: 4, textAlign: "center"
        }}>
          Press Freedom Index 2025
        </div>
        <div style={{
          fontSize: 11, color: "var(--text-muted)",
          fontFamily: "var(--mono)", lineHeight: 1.5,
        }}>
          RSF ranks 180 countries on press freedom. Each tile is a country — colour shows its global score.
        </div>
      </div>

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

              {/* Country list — by rank */}
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
                    display: "flex", 
                    justifyContent: "space-between", 
                    gap: 12,
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
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
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
          position: "fixed",
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
          whiteSpace: "nowrap"
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
  display: "flex", alignItems: "center", gap: 12,
  justifyContent: "center", marginTop: 6,
  fontFamily: "var(--mono)", fontSize: 10,
  color: "var(--text-muted)", flexWrap: "wrap",
}}>
  {[
    { label: "0–40",   color: CATEGORY_COLORS[0] },
    { label: "41–55",  color: CATEGORY_COLORS[1] },
    { label: "56–70",  color: CATEGORY_COLORS[2] },
    { label: "71–85",  color: CATEGORY_COLORS[3] },
    { label: "86–100", color: CATEGORY_COLORS[4] },
    { label: "No data", color: "var(--border)" },
  ].map(({ label, color }) => (
    <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: color === "var(--border)" ? 0.6 : 0.92 }} />
      <span>{label}</span>
    </div>
  ))}
</div>
    </div>
  );
}