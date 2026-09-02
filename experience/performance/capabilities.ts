"use client";

import type { Capabilities } from "@/experience/state/experience-store";

function canPlay(type: string): boolean {
  if (typeof document === "undefined") return false;
  const v = document.createElement("video");
  return v.canPlayType(type) !== "";
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** 첫 렌더 이후 한 번 측정. SSR 에서는 호출하지 않는다. */
export function detectCapabilities(): Capabilities {
  const mq = (q: string) => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false);
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  const mobile = mq("(pointer: coarse)") || window.innerWidth < 900;
  return {
    webgl: hasWebGL(),
    reducedMotion: mq("(prefers-reduced-motion: reduce)"),
    mobile,
    // Chrome/Firefox/Edge: VP9 alpha. Safari 는 vp9 를 "maybe" 로 답하지만 alpha 를 그리지 못하므로 HEVC 로 보낸다.
    webmAlpha: canPlay('video/webm; codecs="vp9"') && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    hevcAlpha: canPlay('video/mp4; codecs="hvc1"') || canPlay('video/quicktime; codecs="hvc1"'),
    saveData: !!nav.connection?.saveData || /(^|\D)2g$/.test(nav.connection?.effectiveType ?? ""),
  };
}
