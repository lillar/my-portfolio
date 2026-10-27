import { COLOR, days, months, dayIndex, byDate, MONTHS, MONTHS_LONG, dateParts, toMin, timeY, fmt1, fmtMm } from "./lib";
import { cellH } from "./layouts";

export const Sw = ({ kind }) => <span className={`ftw-sw ftw-sw-${kind}`} aria-hidden="true" />;

const GOLD_EDGE = "#c99a00";

const Svg = ({ size, children }) => (
  <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">{children}</svg>
);

/* ---------- one enlarged day, labelled layer by layer ---------- */
export function AnatomyOverlay({ meta, size, level, date }) {
  const d = byDate[date];
  const { x, y, w, h } = meta.cell;
  const lx = x + w + 14;
  const narrow = size.w < 600;
  const fs = narrow ? 10.5 : 12;
  const label = (yy, color, lines, key) => (
    <g key={key} className="ftw-fadein">
      <line x1={x + w + 3} x2={lx - 4} y1={yy} y2={yy} stroke={color} strokeWidth={2} />
      {lines.map((t, i) => (
        <text key={i} x={lx} y={yy + 4 + i * (fs + 3)} fontSize={i ? fs - 1 : fs} fill={i ? COLOR.muted : COLOR.ink}>{t}</text>
      ))}
    </g>
  );
  const r = d.r.map(fmtMm);
  const ySr = y + h * timeY(toMin(d.sr)), yPt = y + h * timeY(toMin(d.pt));
  const p = dateParts(d.d);
  const HOURS = ["00–08", "08–16", "16–24"];
  return (
    <Svg size={size}>
      <text x={x + w / 2} y={y + h + (level >= 3 ? Math.max(4, w * 0.14) : 0) + 18} fontSize={fs} textAnchor="middle" fill={COLOR.ink}>
        {`${p.d} ${MONTHS_LONG[p.m - 1]} ${p.y}, ${d.pt}`}
      </text>
      {level === 0 && label(y + h * 0.3, COLOR.ink, ["the morning photo"], "p")}
      {level >= 1 && (
        <g className="ftw-fadein">
          {HOURS.map((t, k) => {
            const cx = x + w * (0.22 + 0.28 * k);   // centre of bar k (see Cell.jsx)
            return (
              <g key={k}>
                <text x={cx} y={y - 24} fontSize={fs - 1} textAnchor="middle" fill={COLOR.muted}>{t}</text>
                <text x={cx} y={y - 9} fontSize={fs} textAnchor="middle" fill={COLOR.rain}>{narrow ? r[k] : `${r[k]} mm`}</text>
              </g>
            );
          })}
        </g>
      )}
      {level >= 1 && label(y + h * 0.07, COLOR.rain, narrow ? ["rain, mm", "cut = over 12 mm"] : ["rain per 8 hours", "white cut = over 12 mm, off the scale"], "r")}
      {level >= 2 && (
        <g className="ftw-fadein">
          {[6, 7, 8].map((hh) => {
            const yy = y + h * timeY(hh * 60);
            return (
              <g key={hh}>
                <line x1={x} x2={x + w} y1={yy} y2={yy} stroke="#fff" strokeOpacity={0.6} strokeDasharray="3 4" />
                <line x1={x - 5} x2={x} y1={yy} y2={yy} stroke={COLOR.muted} />
                <text x={x - 8} y={yy + 4} fontSize={fs - 1} textAnchor="end" fill={COLOR.muted}>{`0${hh}:00`}</text>
              </g>
            );
          })}
        </g>
      )}
      {level >= 2 && label(yPt - 3, COLOR.sun, [narrow ? `photo ${d.pt}` : `photo ${d.pt} (hollow: before sunrise)`], "pt")}
      {level >= 2 && label(ySr + 9, COLOR.sunrise, [`sunrise ${d.sr}`], "sr")}
      {level >= 3 && label(y + h + Math.max(4, w * 0.14) / 2 + 2, "#e0ad00", [narrow ? `sunshine ${d.sp}%` : `sunshine ${fmt1(d.sq)} h, ${d.sp}% of possible`], "s")}
    </Svg>
  );
}

/* ---------- weekly calendars ---------- */
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const utc = (iso) => { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); };

export function CalendarOverlay({ meta, size, mode, titles }) {
  const { w, gap, rowH } = meta;
  const stripH = Math.max(4, w * 0.14);
  return (
    <Svg size={size}>
      {meta.panels.map((p, k) => (
        <g key={k}>
          {titles && <text x={p.x0} y={p.y0 - 26} fontSize={13} fill={COLOR.ink}>{titles[k]}</text>}
          {WEEK.map((t, i) => (
            <text key={i} x={p.x0 + i * (w + gap) + w / 2} y={p.y0 - 8} fontSize={11} textAnchor="middle" fill={i > 4 ? COLOR.ink : COLOR.muted}>{t}</text>
          ))}
          {meta.panels.length === 1 && p.x0 > 40 && Array.from({ length: p.nRows }, (_, r) => {
            const dt = new Date(p.start + r * 7 * 864e5);
            return (
              <text key={r} x={p.x0 - 8} y={p.y0 + r * rowH + w * 0.5} fontSize={10} textAnchor="end" fill={COLOR.muted}>
                {`${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`}
              </text>
            );
          })}
          {mode === "weekend" && (
            <rect className="ftw-fadein" x={p.x0 + 5 * (w + gap) - 4} y={p.y0 - 4} width={2 * w + gap + 8}
              height={p.nRows * rowH - w * 0.12 + 6} rx={6} fill="none" stroke={COLOR.hl} strokeWidth={2.5} />
          )}
          {mode === "away" && days.filter((d) => d.away && !d.f && d.d >= p.from && d.d <= p.to).map((d) => {
            const idx = Math.round((utc(d.d) - p.start) / 864e5);
            return (
              <rect key={d.d} className="ftw-fadein" x={p.x0 + (idx % 7) * (w + gap) - 3} y={p.y0 + Math.floor(idx / 7) * rowH - 3}
                width={w + 6} height={w * 4 / 3 + stripH + 6} rx={4} fill="none" stroke={COLOR.away} strokeWidth={2.5} />
            );
          })}
        </g>
      ))}
    </Svg>
  );
}

/* ---------- month rows ---------- */
export function RowsOverlay({ meta, size, right, highlight = [], badges = [] }) {
  const { x0, w, gap, gridW, R, rows } = meta;
  const colX = (i) => x0 + i * (w + gap);
  const rowFrame = cellH(w);
  return (
    <Svg size={size}>
      {[1, 5, 10, 15, 20, 25, 31].map((n) => (
        <text key={n} x={colX(n - 1) + w / 2} y={rows[0].y - 6} fontSize={10} textAnchor="middle" fill={COLOR.muted}>{n}</text>
      ))}
      {rows.map(({ m, y }, r) => (
        <g key={m.key}>
          <text x={x0 - 8} y={y + Math.min(rowFrame / 2, 13)} fontSize={11} textAnchor="end" fill={COLOR.ink}>{MONTHS[m.m - 1]}</text>
          {(r === 0 || m.m === 1) && rowFrame > 22 && (
            <text x={x0 - 8} y={y + Math.min(rowFrame / 2, 13) + 12} fontSize={9} textAnchor="end" fill={COLOR.muted}>{m.y}</text>
          )}
          {right === "all" && R > 0 && (() => {
            // Rain, sunshine and photos for the month, stacked like the original visual
            const lh = Math.min(13, (cellH(w) + 8) / 3);
            const lines = [
              [m.rain == null ? "no radar yet" : `${Math.round(m.rain)} mm rain${m.rainPartial ? "*" : ""}`, COLOR.rain],
              [`${Math.round(m.sun)} h sun`, "#b58b00"],
              [`${m.photos} photo${m.photos === 1 ? "" : "s"}`, COLOR.ink],
            ];
            return lines.map(([t, c], k) => (
              <text key={k} x={x0 + gridW + 10} y={y + 9 + k * lh} fontSize={11} fill={c}>{t}</text>
            ));
          })()}
          {right && right !== "all" && R > 0 && (
            <text className="ftw-fadein" x={x0 + gridW + 10} y={y + Math.min(rowFrame / 2, 13)} fontSize={11}
              fill={right === "rain" ? COLOR.rain : "#b58b00"}>
              {right === "rain" ? (m.rain == null ? "n/a" : `${Math.round(m.rain)} mm${m.rainPartial ? "*" : ""}`) : `${Math.round(m.sun)} h`}
            </text>
          )}
          {highlight.includes(m.key) && (
            <rect className="ftw-fadein" x={x0 - 4} y={y - 4} width={gridW + 8} height={rowFrame + 8} rx={5}
              fill="none" stroke={COLOR.hl} strokeWidth={2.5} />
          )}
        </g>
      ))}
      {badges.map(({ date, n }) => {
        const d = byDate[date];
        const row = rows.find((r) => r.m.key === date.slice(0, 7));
        const i = Number(d.d.slice(8)) - 1;
        const cx = colX(i) + w / 2, cy = row.y - 2;
        return (
          <g key={date} className="ftw-fadein">
            <rect x={colX(i) - 2.5} y={row.y - 2.5} width={w + 5} height={rowFrame + 5} rx={3} fill="none" stroke={COLOR.hl} strokeWidth={2} />
            <circle cx={cx} cy={cy - 8} r={8} fill={COLOR.hl} />
            <text x={cx} y={cy - 4.5} fontSize={10} textAnchor="middle" fill="#fff" fontWeight={600}>{n}</text>
          </g>
        );
      })}
    </Svg>
  );
}

/* ---------- photo time vs sunrise, the whole year ---------- */
export function ChartOverlay({ meta, size }) {
  const { X, Y, A, m } = meta;
  const left = A.x + m.l, rightX = A.x + A.w - m.r, top = A.y + m.t, bottom = A.y + A.h - m.b;
  const path = (key) => days.map((d, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(toMin(d[key])).toFixed(1)}`).join(" ");
  const monthStarts = months.slice(1).map((mo) => ({ mo, i: dayIndex[mo.days.find(Boolean).d] }));
  const narrow = size.w < 600;
  const note = (date, text, dy) => {
    const d = byDate[date], cx = X(dayIndex[date]), cy = Y(toMin(d.pt));
    const anchor = cx > (left + rightX) / 2 ? "end" : "start";
    return (
      <g className="ftw-fadein">
        <circle cx={cx} cy={cy} r={7} fill="none" stroke={COLOR.hl} strokeWidth={2} />
        <text x={cx + (anchor === "end" ? -10 : 10)} y={cy + dy} fontSize={11} textAnchor={anchor} fill={COLOR.ink}>{text}</text>
      </g>
    );
  };
  const dst = [["2025-10-26", "clocks back"], ["2026-03-29", "clocks forward"]];
  return (
    <Svg size={size}>
      <defs>
        <clipPath id="ftw-chart-clip"><rect x={left} y={top - 2} width={rightX - left} height={bottom - top + 4} /></clipPath>
      </defs>
      {[4, 5, 6, 7, 8, 9].map((hh) => (
        <g key={hh}>
          <line x1={left} x2={rightX} y1={Y(hh * 60)} y2={Y(hh * 60)} stroke="#e2e1dc" />
          <text x={left - 8} y={Y(hh * 60) + 4} fontSize={10} textAnchor="end" fill={COLOR.muted}>{`0${hh}:00`}</text>
        </g>
      ))}
      {monthStarts.map(({ mo, i }) => (
        (!narrow || mo.m % 2 === 1) && (
          <text key={mo.key} x={X(i)} y={bottom + 18} fontSize={10} textAnchor="middle" fill={COLOR.muted}>
            {mo.m === 1 ? `Jan '${String(mo.y).slice(2)}` : MONTHS[mo.m - 1]}
          </text>
        )
      ))}
      {dst.map(([date, t]) => (
        <g key={date}>
          <line x1={X(dayIndex[date])} x2={X(dayIndex[date])} y1={top - 4} y2={bottom} stroke={COLOR.muted} strokeDasharray="2 3" />
          <text x={X(dayIndex[date]) + 4} y={top + 6} fontSize={10} fill={COLOR.muted}>{t}</text>
        </g>
      ))}
      <g clipPath="url(#ftw-chart-clip)">
        <path d={path("dw")} fill="none" stroke={COLOR.sunrise} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
        <path d={path("sr")} fill="none" stroke={COLOR.sunrise} strokeWidth={2.5} />
      </g>
      <text x={X(dayIndex["2026-06-01"])} y={Y(toMin(byDate["2026-06-01"].sr)) - 8} fontSize={11} fill={COLOR.sunrise} textAnchor="middle">sunrise</text>
      <text x={X(dayIndex["2026-03-10"])} y={Y(toMin(byDate["2026-03-10"].dw)) - 8} fontSize={10} fill={COLOR.sunrise} opacity={0.8} textAnchor="middle">civil dawn</text>
      {note("2025-12-22", "87 min before sunrise", -10)}
      {note("2026-07-22", "2 h 37 min after", -10)}
      <g transform={`translate(${narrow ? left : rightX - 230}, ${bottom - 12})`}>
        <circle cx={5} cy={-4} r={4} fill={COLOR.sun} stroke={GOLD_EDGE} />
        <text x={14} y={0} fontSize={10} fill={COLOR.muted}>after sunrise</text>
        <circle cx={100} cy={-4} r={3.4} fill="#fafaf8" stroke={GOLD_EDGE} strokeWidth={1.5} />
        <text x={109} y={0} fontSize={10} fill={COLOR.muted}>before sunrise</text>
      </g>
    </Svg>
  );
}

