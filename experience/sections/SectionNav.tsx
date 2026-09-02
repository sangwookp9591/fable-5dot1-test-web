"use client";

import { useExperience } from "@/experience/state/experience-store";
import { sectionDefs } from "@/experience/timeline/sections";

export function SectionNav() {
  const section = useExperience((s) => s.section);
  const started = useExperience((s) => s.started);
  return (
    <>
      <nav className="section-nav" aria-label="섹션 이동" style={{ opacity: started || section !== "intro" ? 1 : 0, transition: "opacity var(--dur-base)" }}>
        {sectionDefs.map((s) => (
          <a key={s.id} href={`#${s.id}`} aria-current={section === s.id ? "true" : undefined} aria-label={s.label}>
            <span>{s.label}</span>
          </a>
        ))}
      </nav>
      <div className="scroll-hint" style={{ opacity: started && section === "intro" ? 1 : 0 }} aria-hidden="true">
        <i /> 스크롤해서 둘러보기
      </div>
    </>
  );
}
