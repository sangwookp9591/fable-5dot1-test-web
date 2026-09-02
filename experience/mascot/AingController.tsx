"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AingOverlay } from "./AingOverlay";
import { type AingState } from "./states";
import { warmClip } from "./preload";
import { progress, useExperience, SECTIONS, type SectionId } from "@/experience/state/experience-store";
import { sectionDefs } from "@/experience/timeline/sections";
import { aingLines } from "@/experience/content/portfolio";

/** 섹션 컴포넌트가 아잉에게 일시적 반응을 요청할 때 쓰는 이벤트 */
export type AingCue = { state: AingState; line?: string | null; hold?: number };
const CUE_EVENT = "aing:cue";
export function cueAing(cue: AingCue) {
  window.dispatchEvent(new CustomEvent<AingCue>(CUE_EVENT, { detail: cue }));
}

type Placement = { x: number; bottom: number; height: number; flip?: boolean; hidden?: boolean };

/** 섹션별 위치. UI 를 가리지 않도록 콘텐츠 반대편에 둔다. */
function placementFor(section: SectionId, mobile: boolean, vw: number): Placement {
  const h = mobile ? Math.min(150, vw * 0.36) : Math.min(320, Math.max(220, vw * 0.2));
  if (mobile) {
    // 모바일: 오른쪽 아래 작게. 콘텐츠와 겹치지 않게 bottom 여백
    return { x: 78, bottom: 2, height: h, hidden: section === "loop" };
  }
  switch (section) {
    case "intro":
      return { x: 70, bottom: 4, height: h * 1.15 };
    case "career":
      return { x: 84, bottom: 4, height: h, flip: true };
    case "zivo":
      return { x: 86, bottom: 3, height: h * 0.9, flip: true };
    case "loop":
      return { x: 14, bottom: 3, height: h * 0.95 };
    case "studio":
      return { x: 50, bottom: 6, height: h * 0.85 };
    case "ai":
      return { x: 12, bottom: 4, height: h };
    case "review":
      return { x: 86, bottom: 4, height: h, flip: true };
    case "result":
      return { x: 50, bottom: 8, height: h * 1.1 };
  }
}

export function AingController() {
  const section = useExperience((s) => s.section);
  const started = useExperience((s) => s.started);
  const caps = useExperience((s) => s.caps);
  const [state, setState] = useState<AingState>("idle");
  const [line, setLine] = useState<string | null>(null);
  const [vw, setVw] = useState(1440);
  const lineTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const prevSection = useRef<SectionId | null>(null);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const say = useCallback((text: string | null, ms = 3200) => {
    if (lineTimer.current) window.clearTimeout(lineTimer.current);
    setLine(text);
    if (text) lineTimer.current = window.setTimeout(() => setLine(null), ms);
  }, []);

  // 인트로: 시작 전에는 등장 → 대사 2개. 시작 후 idle.
  useEffect(() => {
    if (section !== "intro") return;
    if (!started) {
      setState("enter");
      const t1 = window.setTimeout(() => say(aingLines.intro[0], 2600), 2400);
      const t2 = window.setTimeout(() => say(aingLines.intro[1], 3200), 5200);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    setState("idle");
  }, [section, started, say]);

  // 섹션 진입 시 기본 상태 + 대사
  useEffect(() => {
    if (section === "intro") return;
    const def = sectionDefs.find((s) => s.id === section)!;
    setState(def.aing);
    const l = section === "career" ? aingLines.career
      : section === "zivo" ? aingLines.zivo
      : section === "studio" ? aingLines.studio
      : section === "ai" ? aingLines.ai
      : section === "review" ? aingLines.review
      : section === "result" ? aingLines.result[0]
      : null;
    // 앞뒤로 빠르게 넘길 때 대사가 겹치지 않게 짧게
    if (l && prevSection.current !== section) say(l, 2800);
    prevSection.current = section;
  }, [section, say]);

  // 다음 섹션 클립 미리 받기
  useEffect(() => {
    const ext = caps.webmAlpha ? "webm" : caps.hevcAlpha ? "mov" : null;
    if (!ext || caps.reducedMotion) return;
    const i = SECTIONS.indexOf(section);
    const targets = new Set<AingState>(["idle", sectionDefs[i].aing]);
    if (sectionDefs[i + 1]) targets.add(sectionDefs[i + 1].aing);
    if (section === "loop") ["think", "review", "type", "celebrate"].forEach((s) => targets.add(s as AingState));
    if (section === "zivo") targets.add("surprise");
    if (section === "review") targets.add("error");
    if (section === "result") targets.add("leave");
    targets.forEach((s) => warmClip(s, ext));
  }, [section, caps]);

  // 섹션 컴포넌트의 cue
  useEffect(() => {
    const onCue = (e: Event) => {
      const cue = (e as CustomEvent<AingCue>).detail;
      setState(cue.state);
      if (cue.line !== undefined) say(cue.line, cue.hold ?? 2600);
    };
    window.addEventListener(CUE_EVENT, onCue);
    return () => window.removeEventListener(CUE_EVENT, onCue);
  }, [say]);

  // 결과 섹션 끝: 마지막 인사 후 퇴장
  useEffect(() => {
    if (section !== "result") return;
    let raf = 0;
    let left = false;
    const tick = () => {
      if (progress.local > 0.86 && !left) {
        left = true;
        say(aingLines.result[1], 3000);
        holdTimer.current = window.setTimeout(() => setState("leave"), 1800);
      } else if (progress.local <= 0.86 && left) {
        left = false;
        if (holdTimer.current) window.clearTimeout(holdTimer.current);
        setState("idle");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
    };
  }, [section, say]);

  const onEnded = useCallback((s: AingState) => {
    if (s === "leave") return; // 퇴장 후엔 그대로 (역스크롤 시 섹션 effect 가 복귀시킴)
    setState("idle");
  }, []);

  const p = placementFor(section, caps.mobile, vw);
  const hidden = p.hidden || (state === "leave" && false);

  return (
    <div className="aing-layer" aria-hidden="true">
      <AingOverlay
        state={state}
        x={p.x}
        bottom={p.bottom}
        height={p.height}
        flip={p.flip}
        line={line}
        hidden={hidden}
        onEnded={onEnded}
      />
    </div>
  );
}
