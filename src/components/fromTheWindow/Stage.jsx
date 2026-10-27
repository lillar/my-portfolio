import { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import { days, dayIndex } from "./lib";

// The drawing surface: every day cell, positioned by the active step's layout,
// plus that step's overlay (labels, axes, highlights).
export default function Stage({ step, interactive = false, compactArea = true, style, handlers = {}, label }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize((s) => (s && Math.abs(s.w - width) < 1 && Math.abs(s.h - height) < 1 ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let content = null;
  let stageStyle = style;
  if (size && size.w > 0) {
    // On phones the step text slides over the lower part of the stage, so draw above it
    const narrow = compactArea && size.w < 720;
    const pad = narrow ? 10 : 16;
    const A = { x: pad, y: pad, w: size.w - 2 * pad, h: (narrow ? size.h * 0.52 : size.h) - 2 * pad };
    const L = step.layout(A, size);
    content = (
      <>
        {days.map((d) => (
          <Cell
            key={d.d}
            d={d}
            pos={L.cells[d.d]}
            fade={step.focus ? step.focus(d) : 1}
            hiRes={L.cells[d.d].w > 110}
            delay={step.stagger === false ? 0 : Math.round(dayIndex[d.d] * 1.1)}
            interactive={interactive}
          />
        ))}
        {step.overlay && (
          <div className="ftw-overlay" key={step.id}>
            {step.overlay(L.meta, size)}
          </div>
        )}
      </>
    );
    stageStyle = { ...style, "--dot": `${L.dot}px`, "--gap": `${L.meta.gap ?? 2}px` };
  }

  return (
    <div
      ref={ref}
      className={`ftw-stage ${step.cls || ""}`}
      style={stageStyle}
      role={interactive ? undefined : "img"}
      aria-label={interactive ? undefined : label}
      {...handlers}
    >
      {content}
    </div>
  );
}
