"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { progress, useExperience, SECTIONS, type SectionId } from "@/experience/state/experience-store";
import { sectionDefs } from "./sections";

gsap.registerPlugin(ScrollTrigger);

/**
 * 네이티브 스크롤을 유지하면서 섹션별 진행도를 `progress` 에 기록한다.
 * - 각 섹션 wrapper(data-section) 의 top→bottom 을 local 0..1 로
 * - 화면 중앙을 지나는 섹션을 현재 섹션으로
 * - 전체 진행도 global 0..1
 * 역방향 스크롤도 같은 함수로 계산되므로 상태가 꼬이지 않는다.
 */
export function useScrollTimeline(rootRef: React.RefObject<HTMLElement | null>) {
  const setSection = useExperience((s) => s.setSection);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-section]"));
    const triggers: ScrollTrigger[] = [];
    let lastY = window.scrollY;
    let lastT = performance.now();

    els.forEach((el) => {
      const id = el.dataset.section as SectionId;
      const idx = SECTIONS.indexOf(id);
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progress.locals[id] = self.progress;
            progress.local = self.progress;
            progress.timeline = idx + self.progress;
          },
        }),
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setSection(id);
          },
        }),
      );
    });

    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.global = self.progress;
          const now = performance.now();
          const dt = Math.max(1, now - lastT);
          progress.velocity = ((window.scrollY - lastY) / dt) * 1000;
          lastY = window.scrollY;
          lastT = now;
        },
      }),
    );

    // 첫 프레임에 현재 위치 반영 (뒤로가기 복원 등)
    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.kill());
  }, [rootRef, setSection]);
}

export function sectionLengthVh(id: SectionId): number {
  return sectionDefs.find((s) => s.id === id)?.length ?? 100;
}
