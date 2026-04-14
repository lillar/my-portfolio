import { useState } from "react";
import { melkwegData } from "../data/melkwegData";

// ── Palette ───────────────────────────────────────────────
const COLOR = {
  NL:       "#F67D31",
  EU:       "#5800FF",
  "non-EU": "#15bc9d",
};

// ── Normalise genres ──────────────────────────────────────
const KEEP_GENRES = ["Indie","Electronic","Hiphop","R&B","Pop","Postpunk","Metal","World"];
const normalised = melkwegData.map((d) => ({
  ...d,
  genre: KEEP_GENRES.includes(d.genre) ? d.genre : "Other",
}));

// ── Group and sort by count desc ──────────────────────────
const genreMap = {};
normalised.forEach((d) => {
  if (!genreMap[d.genre]) genreMap[d.genre] = [];
  genreMap[d.genre].push(d);
});
const genres = Object.entries(genreMap)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([genre, concerts]) => ({
    genre,
    concerts,
    total: concerts.length,
    soldOut: concerts.filter((c) => c.soldOut).length,
    soldOutPct: Math.round((concerts.filter((c) => c.soldOut).length / concerts.length) * 100),
  }));

// ── Overall nationality split ─────────────────────────────
const total = normalised.length;
const natSplit = ["NL","EU","non-EU"].map((key) => ({
  key,
  count: normalised.filter((d) => d.nationality === key).length,
  pct: Math.round((normalised.filter((d) => d.nationality === key).length / total) * 100),
}));

// ── Layout ────────────────────────────────────────────────
const DOT_R    = 6;
const DOT_GAP  = 2;
const DOT_STEP = DOT_R * 2 + DOT_GAP;
const ROW_H    = DOT_R * 2 + 10;
const MAX_DOTS = Math.max(...genres.map((g) => g.total)); // 12

const LABEL_W  = 72;
const BAR_W    = MAX_DOTS * DOT_STEP + 4;
const GAP_MET  = 16;
// Fix 1: widen metric columns so "Sold out" header fits
const MET_W    = 44;
const MET_GAP  = 8;

// Fix 3: increase bottom margin for legend breathing room
const MARGIN   = { top: 32, right: 8, bottom: 120, left: 8 };
const CHART_H  = genres.length * ROW_H;
const CHART_W  = LABEL_W + BAR_W + GAP_MET + MET_W + MET_GAP + MET_W;
const SVG_W    = CHART_W + MARGIN.left + MARGIN.right;
const SVG_H    = CHART_H + MARGIN.top + MARGIN.bottom;

const BAR_X    = LABEL_W;
const MET1_X   = LABEL_W + BAR_W + GAP_MET;
const MET2_X   = MET1_X + MET_W + MET_GAP;

export default function MelkwegChart() {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const handleEnter = (e, c) => {
    const rect = e.currentTarget.closest("div")?.getBoundingClientRect();
    if (!rect) return;
    setHovered(c.band);
    setTooltip({ ...c, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleLeave = () => { setHovered(null); setTooltip(null); };

  return (
    <div style={{ width: "100%", position: "relative", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Column headers — same transform as rows so X aligns perfectly ── */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top - 12})`}>
          <text x={MET1_X + MET_W / 2} y={0}
            textAnchor="middle" fontSize={7} fontFamily="var(--mono)"
            fontWeight={600} fill="var(--text-muted)">
            #
          </text>
          {/* Fix 1: "Sold out" fits in MET_W=44 */}
          <text x={MET2_X + MET_W / 2} y={0}
            textAnchor="middle" fontSize={7} fontFamily="var(--mono)"
            fontWeight={600} fill="var(--text-muted)">
            Sold out
          </text>
        </g>

        {/* ── Rows ── */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {genres.map((group, gi) => {
            const rowY  = gi * ROW_H;
            const dotCY = rowY + ROW_H / 2;

            return (
              <g key={group.genre}>
                {gi % 2 === 0 && (
                  <rect x={0} y={rowY} width={CHART_W} height={ROW_H}
                    fill="var(--border)" fillOpacity={0.08} />
                )}

                <text x={LABEL_W - 8} y={dotCY}
                  textAnchor="end" dominantBaseline="middle"
                  fontSize={9} fontFamily="var(--mono)"
                  fontWeight={600} fill="var(--text)">
                  {group.genre}
                </text>

                {group.concerts.map((concert, di) => {
                  const dotCX = BAR_X + di * DOT_STEP + DOT_R + 2;
                  const isHov = hovered === concert.band;
                  const col   = COLOR[concert.nationality];
                  return (
                    <g key={concert.band}
                      onMouseEnter={(e) => handleEnter(e, concert)}
                      onMouseLeave={handleLeave}
                      style={{ cursor: "pointer" }}>
                      {concert.soldOut ? (
                        <circle cx={dotCX} cy={dotCY} r={DOT_R}
                          fill={col} fillOpacity={isHov ? 1 : 0.85}
                          stroke={isHov ? "var(--text)" : "none"} strokeWidth={1.5} />
                      ) : (
                        <circle cx={dotCX} cy={dotCY} r={DOT_R}
                          fill="var(--bg)" stroke={col}
                          strokeWidth={isHov ? 2 : 1.5} opacity={isHov ? 1 : 0.9} />
                      )}
                    </g>
                  );
                })}

                <text x={MET1_X + MET_W / 2} y={dotCY}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fontFamily="var(--mono)" fill="var(--text-muted)">
                  {group.total}
                </text>

                <text x={MET2_X + MET_W / 2} y={dotCY}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fontFamily="var(--mono)"
                  fill={group.soldOutPct >= 70 ? "#15bc9d" : "var(--text-muted)"}>
                  {group.soldOutPct}%
                </text>
              </g>
            );
          })}

          <line x1={0} y1={CHART_H+ROW_H} x2={CHART_W} y2={CHART_H+ROW_H}
            stroke="var(--border)" strokeWidth={0.5} />

          {/* ── Legend ── */}
          <g transform={`translate(0, ${CHART_H + ROW_H + 32})`}>

            {/* Row 1 — nationality stacked bar */}
            <text x={0} y={5} fontSize={7} fontFamily="var(--mono)"
              fill="var(--text-muted)" dominantBaseline="middle">
              nationality
            </text>

            {/* Stacked bar aligned with dot area */}
            {(() => {
              const barY = 0;
              const barH = 10;
              let xCursor = 0;
              return natSplit.map(({ key, count, pct }) => {
                const segW = Math.round((count / total) * (CHART_W - BAR_X));
                const labelX = BAR_X + xCursor + segW / 2;
                const el = (
                  <g key={key}>
                    <rect x={BAR_X + xCursor} y={barY}
                      width={segW} height={barH}
                      fill={COLOR[key]} fillOpacity={0.85} />
                    {/* Fix 5: always show label — inside if wide, above if narrow */}
                    {segW >= 30 ? (
                      <text x={labelX} y={barY + barH / 2}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={7} fontFamily="var(--mono)"
                        fill="white" fontWeight={600}>
                        {key} {pct}%
                      </text>
                    ) : (
                      // narrow segment — label above with tick
                      <g>
                        <line x1={labelX} y1={barY} x2={labelX} y2={barY - 4}
                          stroke={COLOR[key]} strokeWidth={0.8} />
                        <text x={labelX} y={barY - 6}
                          textAnchor="middle" fontSize={6.5}
                          fontFamily="var(--mono)" fill={COLOR[key]} fontWeight={600}>
                          {key} {pct}%
                        </text>
                      </g>
                    )}
                  </g>
                );
                xCursor += segW;
                return el;
              });
            })()}

            {/* Row 2 — fill legend: Fix 4 — show colored dots, not grey */}
            {/* Fix 2: start from x=0, not BAR_X */}
            <g transform={`translate(0, 20)`}>
              <text x={0} y={5} fontSize={7} fontFamily="var(--mono)"
                fill="var(--text-muted)" dominantBaseline="middle">
                fill
              </text>

              {/* Sold out — show all 3 nationality colors filled */}
              <text x={BAR_X} y={5} fontSize={7} fontFamily="var(--mono)"
                fill="var(--text-muted)" dominantBaseline="middle">
                sold out:
              </text>
              {["NL","EU","non-EU"].map((key, i) => (
                <g key={key}>
                  <circle cx={BAR_X + 48 + i * 18} cy={5} r={DOT_R - 1}
                    fill={COLOR[key]} fillOpacity={0.85} />
                </g>
              ))}

              {/* Available — hollow rings */}
              <text x={BAR_X + 100} y={5} fontSize={7} fontFamily="var(--mono)"
                fill="var(--text-muted)" dominantBaseline="middle">
                available:
              </text>
              {["NL","EU","non-EU"].map((key, i) => (
                <g key={key}>
                  <circle cx={BAR_X + 152 + i * 18} cy={5} r={DOT_R - 1}
                    fill="var(--bg)" stroke={COLOR[key]} strokeWidth={1.5} />
                </g>
              ))}
            </g>

          </g>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x > SVG_W * 0.65 ? tooltip.x - 160 : tooltip.x + 12,
          top: tooltip.y - 12,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 4, padding: "6px 10px",
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text)", pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 50, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.band}</div>
          <div style={{ color: COLOR[tooltip.nationality] }}>{tooltip.nationality}</div>
          <div style={{ color: "var(--text-muted)" }}>{tooltip.genre}</div>
          <div style={{ color: tooltip.soldOut ? "#15bc9d" : "var(--text-muted)", marginTop: 2 }}>
            {tooltip.soldOut ? "● sold out" : "○ available"}
          </div>
        </div>
      )}
    </div>
  );
}