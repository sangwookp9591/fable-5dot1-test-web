"use client";

import { useEffect, useState } from "react";

export type LiveVitals = { lcp: number | null; cls: number; inp: number | null; fps: number | null };

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };
type EventTiming = PerformanceEntry & { interactionId?: number; duration: number };

/**
 * 방문자의 브라우저에서 실제로 측정한 값. 라이브러리 없이 PerformanceObserver 만 사용.
 * INP 는 상호작용 duration 의 최대값(근사), FPS 는 최근 1초 rAF 횟수.
 */
export function useLiveVitals(enabled: boolean): LiveVitals {
  const [v, setV] = useState<LiveVitals>({ lcp: null, cls: 0, inp: null, fps: null });
  useEffect(() => {
    if (!enabled || typeof PerformanceObserver === "undefined") return;
    const obs: PerformanceObserver[] = [];
    try {
      const lcp = new PerformanceObserver((l) => {
        const last = l.getEntries().at(-1);
        if (last) setV((s) => ({ ...s, lcp: Math.round(last.startTime) }));
      });
      lcp.observe({ type: "largest-contentful-paint", buffered: true });
      obs.push(lcp);
    } catch {}
    try {
      let cls = 0;
      const o = new PerformanceObserver((l) => {
        for (const e of l.getEntries() as LayoutShift[]) if (!e.hadRecentInput) cls += e.value;
        setV((s) => ({ ...s, cls: Math.round(cls * 1000) / 1000 }));
      });
      o.observe({ type: "layout-shift", buffered: true });
      obs.push(o);
    } catch {}
    try {
      let worst = 0;
      const o = new PerformanceObserver((l) => {
        for (const e of l.getEntries() as EventTiming[]) if (e.interactionId && e.duration > worst) worst = e.duration;
        if (worst) setV((s) => ({ ...s, inp: Math.round(worst) }));
      });
      o.observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
      obs.push(o);
    } catch {}
    let frames = 0;
    let t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      frames++;
      if (t - t0 >= 1000) {
        const fps = Math.round((frames * 1000) / (t - t0));
        setV((s) => (s.fps === fps ? s : { ...s, fps }));
        frames = 0;
        t0 = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      obs.forEach((o) => o.disconnect());
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return v;
}
