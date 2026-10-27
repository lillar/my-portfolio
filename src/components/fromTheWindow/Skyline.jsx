import { useEffect, useState } from "react";
import { COLOR, CAMERA, IMG, byDate, photoDays, MONTHS, dateParts, project } from "./lib";
import { sunPaths } from "../../data/fromTheWindowSunPaths";

const AZ0 = 40, AZ1 = 136;                         // horizon shown: north-east → south-east

// Sunrise on the 21st of each month; months with the same direction share a label
const MARKS = [
  [["2026-06-21"], "Jun"],
  [["2026-05-21", "2026-07-21"], "May · Jul"],
  [["2026-04-21", "2026-08-21"], "Apr · Aug"],
  [["2026-03-21", "2026-09-21"], "Mar · Sep"],
  [["2026-02-21", "2026-10-21"], "Feb · Oct"],
  [["2025-11-21", "2026-01-21"], "Nov · Jan"],
  [["2025-12-21"], "Dec"],
];

// How far the reader has scrolled through the sun walk, 0 → 1. On desktop the walk runs exactly
// while the text card is pinned; on phones (card not pinned) it starts once the card has scrolled up
// out of the way and ends when the next step's card arrives.
function useStepProgress(stepId) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.querySelector(`.ftw-step[data-id="${stepId}"]`);
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const card = el.querySelector(".ftw-card");
      const r = el.getBoundingClientRect(), c = card.getBoundingClientRect();
      const cs = getComputedStyle(card);
      let p;
      if (cs.position === "sticky") {
        const pin = parseFloat(cs.top);
        p = (pin - r.top) / (r.height - c.height);
      } else {
        // starts when the card has moved up past the panorama, ends when the next card takes over
        const vh = window.innerHeight, cb = c.bottom - r.top;
        const top0 = vh * 0.15 - cb, top1 = vh * 0.72 - r.height;   // 0.72: just before the phone trigger line (70–71%)
        p = (top0 - r.top) / (top0 - top1);
      }
      setP(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    for (const d of photoDays) { const im = new Image(); im.src = `${IMG}/a/${d.f}`; }   // preload the frames
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [stepId]);
  return p;
}

// The view from the window, widened (same camera, wider frame) to the whole stretch of horizon
// the sun rises over. Scrolling steps through the photo mornings: where the sun rose, its path
// until the photo, and where it was at that moment — on the photo's own sun in summer.
export function SkylineOverlay({ meta, size, stepId }) {
  const progress = useStepProgress(stepId);
  const { A } = meta;
  const narrow = size.w < 600;
  const { W, H } = CAMERA;

  // Panorama extent in frame pixels, then scaled to fit the stage
  const minX = project(AZ0, 0)[0], maxX = project(AZ1, 0)[0];
  const topPad = 58, bottomPad = 48;
  const ph = Math.min(A.h - topPad - bottomPad, (A.w * H) / (maxX - minX));
  const s = ph / H;
  const sw = (maxX - minX) * s;
  const x0 = A.x + (A.w - sw) / 2;
  const y0 = A.y + topPad + Math.max(0, (A.h - topPad - bottomPad - ph) / 2);
  const P = (az, alt) => { const [fx, fy] = project(az, alt); return [x0 + (fx - minX) * s, y0 + fy * s]; };
  const fx0 = x0 - minX * s, fw = W * s;

  const horizon = [];
  for (let az = AZ0; az <= AZ1; az += 2) horizon.push(P(az, 0));
  const hPath = horizon.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const ground = `${hPath} L${x0 + sw},${y0 + ph} L${x0},${y0 + ph} Z`;

  const d = photoDays[Math.round(progress * (photoDays.length - 1))];
  const path = sunPaths[d.d].map(([az, alt]) => P(az, alt));
  const [sx, sy] = path[0];                         // sunrise
  const [px, py] = path[path.length - 1];           // the photo
  const below = sunPaths[d.d][path.length - 1][1] < 0;
  const outOfView = sx < fx0 || sx > fx0 + fw;
  const line = path.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const dp = dateParts(d.d);
  // Labels go on opposite sides of the path so they don't collide
  const side = (x) => (x < x0 + 100 ? "start" : x > x0 + sw - 100 ? "end" : "middle");

  return (
    <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      <defs>
        <clipPath id="ftw-sky-clip"><rect x={x0} y={y0} width={sw} height={ph} rx={6} /></clipPath>
      </defs>

      {/* compass and date along the top */}
      <text x={x0} y={y0 - 34} fontSize={11} fill={COLOR.muted}>{narrow ? "← NE" : "← north-east"}</text>
      <text x={P(90, 0)[0]} y={y0 - 34} fontSize={11} fill={COLOR.muted} textAnchor="middle">east 90°</text>
      <text x={x0 + sw} y={y0 - 34} fontSize={11} fill={COLOR.muted} textAnchor="end">{narrow ? "SE →" : "south-east →"}</text>
      <text x={x0 + sw} y={y0 - 10} fontSize={12} fill="#e5e7eb" textAnchor="end">{`${dp.d} ${MONTHS[dp.m - 1]} ${dp.y}`}</text>

      {/* sky, ground and the photo where the camera points */}
      <g clipPath="url(#ftw-sky-clip)">
        <rect x={x0} y={y0} width={sw} height={ph} fill="#111827" />
        <path d={ground} fill="#0b111c" />
        <image href={`${IMG}/a/${d.f}`} x={fx0} y={y0} width={fw} height={ph} preserveAspectRatio="none" />
      </g>
      <rect x={fx0} y={y0} width={fw} height={ph} fill="none" stroke="#e5e7eb" strokeOpacity={0.7} strokeDasharray="4 4" />
      <text x={fx0 + fw / 2} y={y0 - 10} fontSize={11} fill={COLOR.muted} textAnchor="middle">what my camera sees</text>
      <path d={hPath} fill="none" stroke="#e5e7eb" strokeOpacity={0.35} strokeDasharray="2 4" />

      {/* sunrise on the 21st of every month */}
      {MARKS.map(([dates, label], m) => {
        const pts = dates.map((dd) => P(byDate[dd].az, 0));
        const lx = pts.reduce((a, [x]) => a + x, 0) / pts.length;
        return (
          <g key={label}>
            {pts.map(([x, y]) => <circle key={x} cx={x} cy={y} r={3} fill={COLOR.sun} opacity={0.55} />)}
            <text x={lx} y={y0 + ph + 16 + (m % 2) * 14} fontSize={10.5} textAnchor="middle" fill={COLOR.muted}>
              {narrow ? label.replace(" · ", "/") : label}
            </text>
          </g>
        );
      })}

      {/* this morning: sunrise ring, the path, and the sun at photo time */}
      <path d={line} fill="none" stroke={COLOR.sun} strokeWidth={2} strokeDasharray="1 5" strokeLinecap="round" />
      <circle cx={sx} cy={sy} r={7} fill="none" stroke={COLOR.sun} strokeWidth={2} />
      <text x={sx} y={below ? sy - 14 : sy + 22} fontSize={11} textAnchor={side(sx)} fill="#fff" stroke="#111827" strokeWidth={3} paintOrder="stroke">
        {`sunrise ${byDate[d.d].sr}${outOfView ? " · out of view" : ""}`}
      </text>
      <circle cx={px} cy={py} r={below ? 7 : 14} fill={COLOR.sun} opacity={below ? 0 : 0.3} />
      <circle cx={px} cy={py} r={7} fill={below ? "none" : COLOR.sun} stroke={COLOR.sun} strokeWidth={2} strokeDasharray={below ? "2 2" : undefined} />
      <text x={px} y={below ? py + 26 : py - 18} fontSize={12} textAnchor={side(px)} fill="#fff" stroke="#111827" strokeWidth={3} paintOrder="stroke">
        {below ? `photo ${d.pt} · sun below the horizon` : `photo ${d.pt}`}
      </text>
    </svg>
  );
}
