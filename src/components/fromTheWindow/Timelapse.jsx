import { useEffect, useRef, useState } from "react";
import { IMG, photoDays, longDate } from "./lib";

// Scroll-scrubbed timelapse: every photo as shot next to the aligned version.
// The teal guide sits on the tower in the aligned frames.
export default function Timelapse() {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const n = photoDays.length;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ref.current.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
      setI(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // Preload the frames once the section gets close
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      for (const d of photoDays) for (const k of ["u", "a"]) { const im = new Image(); im.src = `${IMG}/${k}/${d.f}`; }
      io.disconnect();
    }, { rootMargin: "150% 0px" });
    io.observe(ref.current);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); io.disconnect(); };
  }, [n]);

  const d = photoDays[i];
  return (
    <section ref={ref} className="ftw-timelapse" aria-label="Timelapse of the year's photos, as shot and aligned">
      <div className="ftw-tl-sticky">
        <div className="ftw-tl-frames">
          {[["u", "As shot"], ["a", "Aligned"]].map(([k, t]) => (
            <figure key={k}>
              <div className="ftw-tl-img">
                <img src={`${IMG}/${k}/${d.f}`} alt={`View from the window on ${longDate(d.d)}, ${t.toLowerCase()}`} />
                <span className="ftw-tl-guide" aria-hidden="true" />
              </div>
              <figcaption>{t}</figcaption>
            </figure>
          ))}
        </div>
        <div className="ftw-tl-meta">
          <span>{longDate(d.d)} · {d.pt}</span>
          <span className="ftw-tl-bar"><span style={{ width: `${((i + 1) / n) * 100}%` }} /></span>
          <span>{i + 1} / {n}</span>
        </div>
      </div>
    </section>
  );
}
