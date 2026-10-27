import { IMG, RAIN_CAP, RAIN_BAND, timeY, toMin, dayState, longDate, sunColor, fmt1 } from "./lib";

// One day: photo, rain hanging from the top (3 × 8 h), sunrise segment + photo-time dot,
// sunshine strip underneath. Everything inside is in % so it follows the cell's size.
export default function Cell({ d, pos, fade = 1, hiRes = false, delay = 0, interactive = false }) {
  const state = dayState(d);
  const style = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    width: pos.w,
    height: pos.h,
    opacity: pos.o * fade,
    transitionDelay: `${delay}ms`,
    pointerEvents: interactive && pos.o > 0 ? "auto" : "none",
  };
  const label = `${longDate(d.d)}${d.f ? `, photo at ${d.pt}` : d.away ? ", away" : ", no photo"}`;
  return (
    <div
      className={`ftw-cell s-${state} ${d.pm != null && d.pm < 0 ? "before" : "after"}${pos.ext ? " ext" : ""}`}
      style={style}
      data-date={d.d}
      {...(interactive && pos.o > 0 ? { role: "button", tabIndex: 0, "aria-label": label } : { "aria-hidden": true })}
    >
      <div className="ph" style={d.f ? { backgroundImage: `url(${IMG}/t/${d.f})` } : undefined}>
        {hiRes && d.f && <img src={`${IMG}/m/${d.f}`} alt="" />}
      </div>
      <div className="rain">
        {d.r.map((v, k) => {
          const left = `${10 + k * 28}%`;
          if (v == null) return <i key={k} className={`k${k} nodata`} style={{ left }} />;
          if (v < 0.05) return null;
          const h = (Math.min(v, RAIN_CAP) / RAIN_CAP) * RAIN_BAND * 100;
          const over = v > RAIN_CAP;
          return (
            <i key={k} className={`k${k}${over ? " over" : ""}`} style={{ left, height: `${Math.max(h, 1.2)}%` }}>
              {over && hiRes && <span className="val">{fmt1(v)}</span>}
            </i>
          );
        })}
      </div>
      <div className="sr" style={{ top: `${timeY(toMin(d.sr)) * 100}%` }} />
      {d.f && <div className="dot" style={{ top: `${timeY(toMin(d.pt)) * 100}%` }} />}
      <div className="strip" style={{ background: sunColor(d.sp) }} />
    </div>
  );
}
