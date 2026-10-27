import { days } from "../../data/fromTheWindowData";

export { days };

export const IMG = `${import.meta.env.BASE_URL}blog-images/from-the-window`;

// Same palette as the #30DayChartChallenge charts
export const COLOR = {
  rain: "#5800FF",
  sunrise: "#f97316",
  sun: "#ffc600",
  away: "#b904ca",
  hl: "#15bc9d",
  ink: "#2c2c2c",
  muted: "#888",
  grey: "#dcd9d1",
};

export const RAIN_CAP = 12;      // mm that fills the rain band
export const RAIN_BAND = 0.4;    // share of photo height for rain
export const T0 = 5 * 60, T1 = 9 * 60;   // sunrise band covers 05:00–09:00…
export const TB0 = 0.45, TB1 = 0.96;     // …mapped to this share of photo height

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
export const timeY = (min) => TB0 + ((min - T0) / (T1 - T0)) * (TB1 - TB0);
export const pad = (n) => String(n).padStart(2, "0");
export const fmt1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
export const fmtMm = (v) => (v == null ? "–" : v < 0.05 ? "0" : fmt1(v));

export function dateParts(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}
export const longDate = (iso) => { const p = dateParts(iso); return `${WD[p.wd]} ${p.d} ${MONTHS[p.m - 1]} ${p.y}`; };
export const isWeekend = (d) => { const wd = dateParts(d.d).wd; return wd === 0 || wd === 6; };
export const dayState = (d) => (d.f ? "photo" : d.away ? "away" : "nophoto");
export const rainTotal = (d) => (d.r.every((v) => v != null) ? d.r.reduce((a, b) => a + b, 0) : null);

// Grey (no sun) → yellow (all the sun that was possible). The grey end is a CSS
// variable so it can darken with the page background.
export function sunColor(pct) {
  const t = Math.max(0, Math.min(1, pct / 100)) ** 0.85;
  return `color-mix(in srgb, #ffc600 ${(t * 100).toFixed(1)}%, var(--strip-lo, #dcd9d1))`;
}

export function relSun(pm) {
  if (pm == null) return "";
  if (pm === 0) return "at sunrise";
  const a = Math.abs(pm);
  const t = a >= 60 ? `${Math.floor(a / 60)} h ${a % 60} min` : `${a} min`;
  return pm < 0 ? `${t} before sunrise` : `${t} after sunrise`;
}

export const byDate = Object.fromEntries(days.map((d) => [d.d, d]));
export const dayIndex = Object.fromEntries(days.map((d, i) => [d.d, i]));

// One entry per calendar month in the range, days[0..30] by day of month
export const months = [];
for (const d of days) {
  const p = dateParts(d.d), key = `${p.y}-${pad(p.m)}`;
  let m = months[months.length - 1];
  if (!m || m.key !== key) { m = { key, y: p.y, m: p.m, days: new Array(31).fill(null) }; months.push(m); }
  m.days[p.d - 1] = d;
}
for (const m of months) {
  const inRange = m.days.filter(Boolean);
  const full = inRange.filter((d) => rainTotal(d) != null);
  m.rain = full.length ? full.reduce((s, d) => s + rainTotal(d), 0) : null;
  m.rainPartial = full.length > 0 && full.length < inRange.length;
  m.sun = inRange.reduce((s, d) => s + d.sq, 0);
  m.photos = inRange.filter((d) => d.f).length;
}

export const photoDays = days.filter((d) => d.f);

// Where the camera looks, fitted from 33 photos with the sun in shot: the sun's real
// position at photo time vs. where it appears in the aligned frame (median error ≈ 2.5 px).
// Pinhole model in the aligned 644 × 858 frame.
export const CAMERA = { heading: 77.78, pitch: 6.03, roll: 1.29, f: 653.98, cx: 322, cy: 401.5, W: 644, H: 858 };

const rad = (deg) => (deg * Math.PI) / 180;

// Sun direction (azimuth°, altitude°) → pixel in the frame. Works beyond the frame edges too,
// as if the photo were wider, so the whole stretch of horizon shares one projection.
export function project(az, alt) {
  const { heading, pitch, roll, f, cx, cy } = CAMERA;
  const h = rad(heading), p = rad(pitch), r = rad(roll), a = rad(az), e = rad(alt);
  const D = [Math.cos(e) * Math.sin(a), Math.cos(e) * Math.cos(a), Math.sin(e)];
  const fwd = [Math.sin(h) * Math.cos(p), Math.cos(h) * Math.cos(p), Math.sin(p)];
  const right = [Math.cos(h), -Math.sin(h), 0];
  const up = [right[1] * fwd[2] - right[2] * fwd[1], right[2] * fwd[0] - right[0] * fwd[2], right[0] * fwd[1] - right[1] * fwd[0]];
  const rr = right.map((v, i) => v * Math.cos(r) + up[i] * Math.sin(r));
  const uu = right.map((v, i) => -v * Math.sin(r) + up[i] * Math.cos(r));
  const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  const z = dot(D, fwd);
  return [cx + (f * dot(D, rr)) / z, cy - (f * dot(D, uu)) / z];
}
