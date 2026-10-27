import { useEffect, useRef, useState } from "react";
import Stage from "./Stage";
import { yearLayout, yearHeightFor } from "./layouts";
import { RowsOverlay } from "./overlays";
import { IMG, byDate, photoDays, longDate, relSun, fmt1, fmtMm, rainTotal } from "./lib";

const TOTALS_W = 104;   // room for "104 mm rain" / "82 h sun" / "20 photos"

const step = {
  id: "explore",
  cls: "L-photo L-rain L-sunrise L-strip",
  layout: (A) => yearLayout(A, null, TOTALS_W),
  overlay: (meta, size) => <RowsOverlay meta={meta} size={size} right="all" />,
  stagger: false,
};

function details(d) {
  const total = rainTotal(d);
  return [
    ["Photo", d.f ? `${d.pt} · ${relSun(d.pm)}${d.away ? " · left later that day" : ""}` : d.away ? "none, I was away" : "none this day"],
    ["Sunrise", `${d.sr} · dawn ${d.dw} · ${fmt1(d.dl)} h of daylight`],
    ["Rain", d.r.every((v) => v == null) ? "not yet released" : `${d.r.map(fmtMm).join(" · ")} mm${total != null ? ` = ${fmtMm(total)} mm` : ""}`],
    ["Sunshine", `${fmt1(d.sq)} h · ${d.sp}% of possible`],
    ["Cloud", d.ng === 9 ? "sky invisible (fog)" : `${d.ng}/8 on average`],
    ["Temp", `${fmt1(d.tn)} to ${fmt1(d.tx)} °C`],
  ];
}

const Details = ({ d }) => (
  <dl>{details(d).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
);

export default function Explore() {
  const wrap = useRef(null);
  const dlg = useRef(null);
  const [width, setWidth] = useState(0);
  const [photos, setPhotos] = useState(true);
  const [tip, setTip] = useState(null);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = dlg.current;
    if (open >= 0 && !el.open) el.showModal();
    if (open < 0 && el.open) el.close();
  }, [open]);

  const cellOf = (e) => e.target.closest?.(".ftw-cell[data-date]");
  const show = (e) => {
    const c = cellOf(e);
    if (!c) return setTip(null);
    const r = c.getBoundingClientRect();
    setTip({ d: byDate[c.dataset.date], r, y: e.clientY ?? r.top });
  };
  const openCell = (c) => {
    const i = photoDays.findIndex((d) => d.d === c.dataset.date);
    if (i >= 0) { setTip(null); setOpen(i); }
  };
  const handlers = {
    onPointerOver: show,
    onPointerMove: (e) => { if (tip) show(e); },
    onPointerLeave: () => setTip(null),
    onFocus: show,
    onBlur: () => setTip(null),
    onClick: (e) => { const c = cellOf(e); if (c) openCell(c); },
    onKeyDown: (e) => { const c = cellOf(e); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCell(c); } },
  };

  let tipStyle;
  if (tip) {
    const tw = 360, vw = window.innerWidth, vh = window.innerHeight;
    let x = tip.r.right + 12;
    if (x + tw > vw - 12) x = tip.r.left - tw - 12;
    tipStyle = { left: Math.max(12, x), top: Math.max(12, Math.min(tip.y - 60, vh - 380)) };
  }
  const cur = open >= 0 ? photoDays[open] : null;
  const go = (k) => setOpen((open + k + photoDays.length) % photoDays.length);

  return (
    <div className="ftw-explore">
      <div className="ftw-explore-bar">
        <label><input type="checkbox" checked={photos} onChange={(e) => setPhotos(e.target.checked)} /> Show photos</label>
        <span className="ftw-legend">
          <span className="ftw-sw ftw-sw-rain" /> rain 00–08 · 08–16 · 16–24
          <span className="ftw-sw ftw-sw-sunrise" /> sunrise
          <span className="ftw-sw ftw-sw-dot" /> photo after / <span className="ftw-sw ftw-sw-hollow" /> before sunrise
          <span className="ftw-sw ftw-sw-sun" /> sunshine
          <span className="ftw-sw ftw-sw-away" /> away
        </span>
      </div>
      <div ref={wrap} className={photos ? "" : "ftw-hide-photos"}>
        {width > 0 && (
          <Stage step={step} interactive compactArea={false} handlers={handlers}
            style={{ height: yearHeightFor(width - 32, TOTALS_W) + 32 }} />
        )}
      </div>
      <p className="ftw-note">Hover a day for the details, click a photo to open it. A white cut through a rain bar means it went over 12 mm. * September rain stops on the 30th at 10:00; October 2026 radar is not released yet.</p>

      {tip && (
        <div className="ftw-tip" style={tipStyle} role="tooltip">
          {tip.d.f ? <img src={`${IMG}/m/${tip.d.f}`} alt="" /> : <div className="ftw-tip-nop">{tip.d.away ? "Away" : "No photo this morning"}</div>}
          <h3>{longDate(tip.d.d)}</h3>
          <Details d={tip.d} />
        </div>
      )}

      <dialog ref={dlg} className="ftw-lightbox" onClose={() => setOpen(-1)}
        onClick={(e) => { if (e.target === dlg.current) setOpen(-1); }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}>
        {cur && (
          <div className="ftw-lb">
            <img src={`${IMG}/m/${cur.f}`} alt={`View from the window, ${longDate(cur.d)} at ${cur.pt}`} />
            <div>
              <h3>{longDate(cur.d)}</h3>
              <Details d={cur} />
              <div className="ftw-lb-nav">
                <button type="button" onClick={() => go(-1)}>← Previous</button>
                <button type="button" onClick={() => go(1)}>Next →</button>
                <button type="button" onClick={() => setOpen(-1)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
