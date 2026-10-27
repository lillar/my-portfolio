// Layouts place every day cell inside the stage. Each returns
// { cells: { [date]: { x, y, w, h, o } }, meta, dot } where w × h is the photo box
// (the sunshine strip hangs below it). Cells a layout doesn't use keep their
// year-grid position at opacity 0, so they fade in where they will end up.

import { days, months, dayIndex, toMin } from "./lib";

const PH = 4 / 3;                                   // photo height / width
const STRIP = (w) => Math.max(4, w * 0.14);         // strip + its gap
export const cellH = (w) => w * PH + STRIP(w);
const rowGapOf = (w) => w * 0.3 + 5;
const GAP = 0.08;                                   // column gap as share of cell width

// R is the right-hand column for month totals (none on phones)
function frame(A, R0 = 58) {
  const narrow = A.w < 600;
  return { L: narrow ? 30 : 46, R: narrow ? 0 : R0, top: 16 };
}

// Cell width that fits n month rows into the area
function yearWidth(A, n, R0) {
  const { L, R, top } = frame(A, R0);
  const byW = (A.w - L - R) / (31 + 30 * GAP);
  const byH = ((A.h - top - 8) / n - 9) / (PH + 0.44);
  return Math.max(4, Math.min(byW, byH));
}

export function yearHeightFor(width, R0) {
  const A = { x: 0, y: 0, w: width, h: 1e6 };
  const { L, R, top } = frame(A, R0);
  const w = (A.w - L - R) / (31 + 30 * GAP);
  return top + months.length * (cellH(w) + rowGapOf(w)) + 8;
}

export function rowsLayout(A, keys = null, R0) {
  const list = keys ? months.filter((m) => keys.includes(m.key)) : months;
  const { L, R, top } = frame(A, R0);
  const w = yearWidth(A, list.length, R0);
  const gap = w * GAP, rowH = cellH(w) + rowGapOf(w);
  const gridW = 31 * w + 30 * gap;
  const x0 = A.x + L + (A.w - L - R - gridW) / 2;
  const y0 = A.y + top + Math.max(0, (A.h - top - list.length * rowH) / 2);
  const cells = {};
  const rows = list.map((m, r) => {
    const y = y0 + r * rowH;
    m.days.forEach((d, i) => { if (d) cells[d.d] = { x: x0 + i * (w + gap), y, w, h: w * PH, o: 1, ext: !!m.days[i + 1] }; });
    return { m, y, h: w * PH };
  });
  return { cells, meta: { kind: "rows", rows, x0, y0, w, gap, rowH, gridW, L, R, A }, dot: Math.max(5, Math.min(9, w * 0.3)) };
}

// Fill in cells a layout left out with their (hidden) year-grid position
function withFallback(A, layout) {
  const year = rowsLayout(A).cells;
  for (const d of days) if (!layout.cells[d.d]) layout.cells[d.d] = { ...year[d.d], o: 0 };
  return layout;
}

export function yearLayout(A, keys = null, R0) {
  return withFallback(A, rowsLayout(A, keys, R0));
}

export function singleLayout(A, date, labelW) {
  const lw = Math.min(labelW, A.w * 0.5);
  const hourW = 40;                                  // room for the 06:00–08:00 labels on the left
  const w = Math.min((A.h * 0.76) / (PH + 0.14), (A.w - lw - hourW) * (A.w < 600 ? 1 : 0.7), 300);
  const h = w * PH;
  const x = A.x + hourW + (A.w - hourW - w - lw) / 2;
  const y = A.y + (A.h - cellH(w)) / 2 + 6;   // a little extra room above for the bar labels
  return withFallback(A, { cells: { [date]: { x, y, w, h, o: 1 } }, meta: { kind: "single", cell: { x, y, w, h }, A }, dot: Math.max(8, w * 0.07) });
}

// Weekly calendars (Mon–Sun), one panel per date range, side by side
const utc = (iso) => { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); };
export function calendarLayout(A, panels) {
  const head = panels.length > 1 ? 40 : 22, gapF = 0.1, panelGap = 28;
  const specs = panels.map((p) => {
    const f = new Date(utc(p.from));
    const start = utc(p.from) - ((f.getUTCDay() + 6) % 7) * 864e5;   // Monday on or before
    const nRows = Math.floor((utc(p.to) - start) / 864e5 / 7) + 1;
    return { ...p, start, nRows };
  });
  const maxRows = Math.max(...specs.map((s) => s.nRows));
  const n = specs.length;
  const w = Math.min(
    (A.w - 8 - (n - 1) * panelGap) / (n * (7 + 6 * gapF)),
    (A.h - head - 8) / (maxRows * (PH + 0.14 + 0.12)),
    120,
  );
  const gap = w * gapF, rowH = cellH(w) + w * 0.12, gridW = 7 * w + 6 * gap;
  const totalW = n * gridW + (n - 1) * panelGap;
  const y0 = A.y + head + Math.max(0, (A.h - head - maxRows * rowH) / 2);
  const cells = {};
  const metaPanels = specs.map((s, k) => {
    const x0 = A.x + (A.w - totalW) / 2 + k * (gridW + panelGap);
    for (const d of days) {
      if (d.d < s.from || d.d > s.to) continue;
      const idx = Math.round((utc(d.d) - s.start) / 864e5);
      cells[d.d] = { x: x0 + (idx % 7) * (w + gap), y: y0 + Math.floor(idx / 7) * rowH, w, h: w * PH, o: 1, ext: idx % 7 < 6 && d.d < s.to };
    }
    return { ...s, x0, y0, gridW };
  });
  return withFallback(A, { cells, meta: { kind: "calendar", panels: metaPanels, w, gap, rowH, head, A }, dot: Math.max(5, Math.min(10, w * 0.12)) });
}

// Timeline chart runs 04:00–09:00, so civil dawn in June (around 04:30) fits
const CHART_T0 = 4 * 60, CHART_T1 = 9 * 60;

// Every photo as a dot: x = date, y = time of day (earlier = higher)
export function chartLayout(A) {
  const m = { l: 46, r: 14, t: 18, b: 30 };
  const pw = A.w - m.l - m.r, ph = A.h - m.t - m.b;
  const X = (i) => A.x + m.l + (i / (days.length - 1)) * pw;
  const Y = (min) => A.y + m.t + ((min - CHART_T0) / (CHART_T1 - CHART_T0)) * ph;
  const s = Math.max(5, Math.min(8, pw / 110));
  const cells = {};
  for (const d of days) {
    if (!d.f) continue;
    cells[d.d] = { x: X(dayIndex[d.d]) - s / 2, y: Y(toMin(d.pt)) - s / 2, w: s, h: s, o: 1 };
  }
  return withFallback(A, { cells, meta: { kind: "chart", X, Y, m, pw, ph, A }, dot: s });
}

// Nothing in the grid: an overlay takes the stage
export function emptyLayout(A) {
  return withFallback(A, { cells: {}, meta: { kind: "empty", A }, dot: 4 });
}
