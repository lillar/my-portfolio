import { COLOR } from "./lib";

// September 2026: radar at the window vs KNMI's validated station totals
const ROWS = [
  { label: "Radar, my window", mm: 90.8, mine: true },
  { label: "Schiphol (station)", mm: 90.0 },
  { label: "Berkhout (station)", mm: 93.4 },
  { label: "Wijk aan Zee (station)", mm: 83.2 },
];

export default function CrossCheck() {
  const W = 600, L = 200, R = 56, bh = 22, gap = 12, max = 100;
  const H = ROWS.length * (bh + gap) + 24;
  const x = (v) => L + (v / max) * (W - L - R);
  return (
    <figure className="ftw-figure">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="Bar chart of September 2026 rain: radar at the window 90.8 mm, Schiphol 90.0 mm, Berkhout 93.4 mm, Wijk aan Zee 83.2 mm.">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={0} y2={H - 20} stroke="#e2e1dc" />
            <text x={x(v)} y={H - 4} fontSize={11} textAnchor="middle" fill={COLOR.muted}>{v}{v === 100 ? " mm" : ""}</text>
          </g>
        ))}
        {ROWS.map((r, i) => {
          const y = i * (bh + gap);
          return (
            <g key={r.label}>
              <text x={L - 10} y={y + bh / 2 + 4} fontSize={13} textAnchor="end" fill={COLOR.ink}>{r.label}</text>
              <rect x={L} y={y} width={x(r.mm) - L} height={bh} rx={3} fill={r.mine ? COLOR.rain : "#c9c6bd"} />
              <text x={x(r.mm) + 6} y={y + bh / 2 + 4} fontSize={12} fill={COLOR.ink}>{r.mm.toFixed(1)}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>Rain in September 2026. The radar figure stops at 30 September, 10:00; the station totals are KNMI's validated monthly values.</figcaption>
    </figure>
  );
}
