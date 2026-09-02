"use client";

import { profile } from "@/experience/content/portfolio";
import { useExperience } from "@/experience/state/experience-store";
import { sectionDefs } from "@/experience/timeline/sections";

export function SectionNav() {
  const section = useExperience((s) => s.section);
  const started = useExperience((s) => s.started);
  const reduced = useExperience((s) => s.caps.reducedMotion);
  // 시작 전에는 아예 감춘다. opacity 0 만 주면 키보드 포커스가 안 보이는 링크로 들어간다.
  const shown = started || section !== "intro";

  return (
    <>
      {/* 어느 섹션에서든 연락할 수 있게 오른쪽 위에 고정 */}
      <div className="contact-bar" hidden={!shown}>
        <span className="contact-name">{profile.name}</span>
        <a href={`mailto:${profile.email}`}>메일</a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <button
          type="button"
          className="contact-top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
        >
          처음으로
        </button>
      </div>
      <nav className="section-nav" aria-label="섹션 이동" hidden={!shown}>
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
