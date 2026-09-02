"use client";

import { AING_BASE, clips, type AingState } from "./states";

const warmed = new Set<string>();

/** 브라우저 HTTP 캐시를 미리 채운다. video 요소에 src 를 넣을 때 네트워크 대기 없이 decode 만 하도록. */
export function warmClip(state: AingState, ext: "webm" | "mov"): void {
  const url = `${AING_BASE}/${clips[state].file}.${ext}`;
  if (warmed.has(url) || typeof window === "undefined") return;
  warmed.add(url);
  // saveData 환경이면 미리 받지 않는다 (사용 시점에만)
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return;
  fetch(url, { cache: "force-cache", priority: "low" } as RequestInit).catch(() => warmed.delete(url));
}

export function clipUrl(state: AingState, ext: "webm" | "mov"): string {
  return `${AING_BASE}/${clips[state].file}.${ext}`;
}

export function fallbackUrl(state: AingState): string {
  return `${AING_BASE}/fallback/${clips[state].fallback}.webp`;
}
