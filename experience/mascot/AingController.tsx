"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AingOverlay } from "./AingOverlay";
import { type AingState } from "./states";
import { warmClip } from "./preload";
import { progress, useExperience, SECTIONS, type SectionId } from "@/experience/state/experience-store";
import { sectionDefs } from "@/experience/timeline/sections";
import { aingLines } from "@/experience/content/portfolio";
import { anchors } from "@/experience/scene/anchors";

/** 섹션 컴포넌트가 아잉에게 일시적 반응을 요청할 때 쓰는 이벤트 */
export type AingCue = { state: AingState; line?: string | null; hold?: number; /** 이 섹션이 활성일 때만 반영 */ section?: SectionId };
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
    return { x: 80, bottom: 1.5, height: section === "result" || section === "review" ? h * 0.75 : h, hidden: section === "loop" };
  }
  switch (section) {
    case "intro":
      return { x: 70, bottom: 4, height: h * 1.15 };
    case "career":
      return { x: 84, bottom: 4, height: h };
    case "zivo":
      return { x: 86, bottom: 3, height: h * 0.9 };
    case "loop":
      return { x: 90, bottom: 3, height: h * 0.8 };
    case "studio":
      return { x: 8, bottom: 3, height: h * 0.7, flip: true };
    case "ai":
      return { x: 86, bottom: 4, height: h };
    case "review":
      return { x: 86, bottom: 4, height: h };
    case "result":
      return { x: 86, bottom: 5, height: h * 1.05 };
  }
}

export function AingController() {
  const section = useExperience((s) => s.section);
  const started = useExperience((s) => s.started);
  const caps = useExperience((s) => s.caps);
  const sceneFailed = useExperience((s) => s.sceneFailed);
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

  // 인트로: 처음 들어오면 등장 → 대사 2개. [바로 보기] 를 눌러도 걷는 클립은 끊지 않고 끝나면 idle 로.
  // introDone 은 enter 클립이 끝났거나 인트로를 떠났을 때 true. (effect 는 idempotent — StrictMode 이중 실행에도 안전)
  const introDone = useRef(false);
  useEffect(() => {
    if (section !== "intro") {
      introDone.current = true;
      return;
    }
    if (introDone.current) {
      setState((s) => (s === "leave" ? s : "idle"));
      return;
    }
    setState("enter");
    const t1 = window.setTimeout(() => say(aingLines.intro[0], 2600), 2400);
    const t2 = window.setTimeout(() => say(aingLines.intro[1], 3200), 5200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [section, say]);

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
      if (cue.section && useExperience.getState().section !== cue.section) return;
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
    if (s === "enter") introDone.current = true;
    if (s === "leave") return; // 퇴장 후엔 그대로 (역스크롤 시 섹션 effect 가 복귀시킴)
    setState("idle");
  }, []);

  // 책상 뒤 자리: 3D 앵커를 따라 위치·크기·가림선을 매 프레임 갱신 (데스크톱, 3D 살아있을 때만)
  const useAnchor = section === "loop" && !caps.mobile && !sceneFailed && caps.webgl;
  const [anch, setAnch] = useState<{ x: number; bottom: number; height: number; clip: number } | null>(null);
  useEffect(() => {
    if (!useAnchor) {
      setAnch(null);
      return;
    }
    let raf = 0;
    const tick = () => {
      const a = anchors.deskSeat;
      if (a && a.ok && a.h > 40) {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const frameH = a.h / 0.805;
        const bottomPx = a.y + (frameH * 56) / 720; // 프레임 아래 여백만큼 컨테이너가 더 내려감
        const clip = Number.isNaN(a.cut) ? 0 : Math.max(0, bottomPx - a.cut);
        setAnch((prev) => {
          const next = { x: (a.x / W) * 100, bottom: ((H - bottomPx) / H) * 100, height: a.h, clip };
          return prev && Math.abs(prev.x - next.x) < 0.02 && Math.abs(prev.bottom - next.bottom) < 0.02 && Math.abs(prev.height - next.height) < 0.5 && Math.abs(prev.clip - next.clip) < 0.5 ? prev : next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [useAnchor]);

  const p = placementFor(section, caps.mobile, vw);
  const anchored = useAnchor && anch;
  const hidden = p.hidden;

  return (
    <div className="aing-layer" aria-hidden="true">
      <AingOverlay
        state={state}
        x={anchored ? anch.x : p.x}
        bottom={anchored ? anch.bottom : p.bottom}
        height={anchored ? anch.height : p.height}
        flip={p.flip}
        line={line}
        hidden={hidden}
        clipPath={anchored && anch.clip > 0 ? `inset(0 0 ${anch.clip.toFixed(1)}px 0)` : undefined}
        instant={!!anchored}
        onEnded={onEnded}
      />
    </div>
  );
}
