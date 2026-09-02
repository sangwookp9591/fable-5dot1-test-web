"use client";

import { useEffect } from "react";
import { progress, useExperience } from "@/experience/state/experience-store";

/** 포인터 위치를 -1..1 로 정규화해 `progress` 에 기록. 터치/reduced-motion 이면 0 고정. */
export function usePointerTracking() {
  const { mobile, reducedMotion } = useExperience((s) => s.caps);
  useEffect(() => {
    if (mobile || reducedMotion) {
      progress.pointerX = 0;
      progress.pointerY = 0;
      return;
    }
    const onMove = (e: PointerEvent) => {
      progress.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      progress.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      progress.pointerX = 0;
      progress.pointerY = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mobile, reducedMotion]);
}
