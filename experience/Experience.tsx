"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useExperience } from "@/experience/state/experience-store";
import { detectCapabilities } from "@/experience/performance/capabilities";
import { useScrollTimeline } from "@/experience/timeline/useScrollTimeline";
import { usePointerTracking } from "@/experience/interactions/usePointer";
import { AingController } from "@/experience/mascot/AingController";
import { SectionNav } from "@/experience/sections/SectionNav";
import { SceneBoundary } from "@/experience/scene/SceneBoundary";
import { Intro } from "@/experience/sections/Intro";
import { Career } from "@/experience/sections/Career";
import { Zivo } from "@/experience/sections/Zivo";
import { WorkLoop } from "@/experience/sections/WorkLoop";
import { StudioTour } from "@/experience/sections/StudioTour";
import { Ai } from "@/experience/sections/Ai";
import { Review } from "@/experience/sections/Review";
import { Result } from "@/experience/sections/Result";

// Three.js 는 첫 화면 LCP 에 끼지 않도록 클라이언트에서 지연 로드. 실패해도 DOM 은 그대로.
const StudioScene = dynamic(() => import("@/experience/scene/StudioScene").then((m) => m.StudioScene), {
  ssr: false,
  loading: () => null,
});

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const setCaps = useExperience((s) => s.setCaps);
  const caps = useExperience((s) => s.caps);
  const sceneFailed = useExperience((s) => s.sceneFailed);
  const failScene = useExperience((s) => s.failScene);

  useEffect(() => {
    setCaps(detectCapabilities());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setCaps({ reducedMotion: mq.matches });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setCaps]);

  useScrollTimeline(rootRef);
  usePointerTracking();

  const show3D = caps.webgl && !sceneFailed && !caps.saveData;

  return (
    <>
      <a href="#intro" className="skip-link">
        본문으로 건너뛰기
      </a>
      {/* 배경: 스튜디오 3D scene (고정). 실패/미지원 시 정적 배경 */}
      <div className="scene-layer" aria-hidden="true">
        {show3D ? (
          <SceneBoundary onError={failScene}>
            <StudioScene />
          </SceneBoundary>
        ) : (
          <div className="scene-fallback" />
        )}
      </div>

      <main ref={rootRef} id="main" className="experience" data-reduced={caps.reducedMotion ? "" : undefined}>
        <Intro />
        <Career />
        <Zivo />
        <WorkLoop />
        <StudioTour />
        <Ai />
        <Review />
        <Result />
      </main>

      <AingController />
      <SectionNav />
    </>
  );
}
