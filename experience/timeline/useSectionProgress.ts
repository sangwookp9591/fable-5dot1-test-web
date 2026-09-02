"use client";

import { useEffect, useRef, useState } from "react";
import { progress, useExperience, SECTIONS, type SectionId } from "@/experience/state/experience-store";

/** 섹션이 활성(또는 바로 인접)일 때만 rAF 로 local progress(0..1) 를 콜백에 전달한다. 값이 바뀔 때만 호출. */
export function useSectionFrame(id: SectionId, onFrame: (t: number) => void) {
  const section = useExperience((s) => s.section);
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  });
  useEffect(() => {
    const i = SECTIONS.indexOf(id);
    const j = SECTIONS.indexOf(section);
    if (Math.abs(i - j) > 1) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      const t = progress.locals[id];
      if (t !== last) {
        last = t;
        cb.current(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, section]);
}

/** 진행도 t 와 임계값 배열 → 단계 index (0..thresholds.length). 순수 함수 — 테스트 대상. */
export function stepFor(t: number, thresholds: readonly number[]): number {
  let s = 0;
  for (let k = 0; k < thresholds.length; k++) if (t >= thresholds[k]) s = k + 1;
  return s;
}

/**
 * 임계값을 지날 때만 바뀌는 단계 index. 역방향 스크롤도 같은 규칙.
 * reduced-motion 이면 스크롤로 단계를 숨기지 않고 항상 최종 단계를 보여준다 (콘텐츠 접근 동일, spec §20).
 */
export function useSteps(id: SectionId, thresholds: readonly number[]): number {
  const [step, setStep] = useState(0);
  const reduced = useExperience((s) => s.caps.reducedMotion);
  useSectionFrame(id, (t) => {
    const s = stepFor(t, thresholds);
    setStep((prev) => (prev === s ? prev : s));
  });
  return reduced ? thresholds.length : step;
}

/** 요소에 CSS 변수 --t (0..1, 선택적 구간 매핑) 를 60fps 로 기록. React 재렌더 없음. */
export function useProgressVar<T extends HTMLElement>(id: SectionId, from = 0, to = 1) {
  const ref = useRef<T>(null);
  useSectionFrame(id, (t) => {
    const v = Math.min(1, Math.max(0, (t - from) / (to - from)));
    ref.current?.style.setProperty("--t", v.toFixed(4));
  });
  return ref;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const remap = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
