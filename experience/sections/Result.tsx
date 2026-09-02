"use client";

import { Section } from "./Section";
import { howIWork, profile } from "@/experience/content/portfolio";
import { useExperience } from "@/experience/state/experience-store";

export function Result() {
  const reduced = useExperience((s) => s.caps.reducedMotion);
  const replay = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  return (
    <Section id="result" label="마무리">
      <div className="result kr" style={{ maxWidth: 820, margin: "0 auto" }}>
        <p className="eyebrow">Result</p>
        <h2 className="h-display">그래서 박상욱, 쓸 만했을까요?</h2>
        <p className="lead" style={{ maxWidth: 560, margin: "0 auto 8px" }}>
          {howIWork.closing[0]} {howIWork.closing[1]}
        </p>
        <div className="result-board" aria-label="한눈에 보기">
          <div><div className="k">화면</div><div className="v">React · Next.js · RN</div></div>
          <div><div className="k">서버</div><div className="v">Spring Boot · NestJS</div></div>
          <div><div className="k">배포</div><div className="v">AWS · Docker · Actions</div></div>
          <div><div className="k">품질</div><div className="v">Playwright 10회 연속 성공</div></div>
          <div><div className="k">운영</div><div className="v">14개 언어 · 9개월</div></div>
          <div><div className="k">AI</div><div className="v">직접 써보고 팀에 공유</div></div>
        </div>
        <ul className="intro-points" style={{ textAlign: "left", maxWidth: 620, margin: "0 auto 8px" }}>
          {howIWork.habits.map((h) => (
            <li key={h.t}>
              <b>{h.t}</b>
              <span>{h.d}</span>
            </li>
          ))}
        </ul>
        <div className="result-actions">
          <a className="btn btn-orange" href={`mailto:${profile.email}`}>메일 보내기</a>
          <a className="btn btn-primary" href={profile.github} target="_blank" rel="noreferrer">GitHub {profile.githubHandle}</a>
          <button type="button" className="btn btn-ghost" onClick={replay}>다시 보기</button>
          <a className="btn btn-ghost" href={profile.source} target="_blank" rel="noreferrer">이 사이트 소스 보기</a>
        </div>
        <p className="result-foot">
          {profile.name} · {profile.email} · <a href={profile.web} target="_blank" rel="noreferrer">{profile.webLabel}</a> · <a href={profile.youtube} target="_blank" rel="noreferrer">YouTube AI-NG</a>
          <br />
          이 사이트: Next.js 16 · Bun · Three.js · GSAP · 아잉 영상은 Higgsfield(Kling 3.0) · 만든 건 Claude Fable 5.1
        </p>
      </div>
    </Section>
  );
}
