"use client";

import { Section } from "./Section";
import { howIWork, profile } from "@/experience/content/portfolio";
import { useExperience } from "@/experience/state/experience-store";

export function Result() {
  const reduced = useExperience((s) => s.caps.reducedMotion);
  const replay = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  return (
    <Section id="result" label="마무리">
      <div className="result kr panel">
        <p className="eyebrow">마무리</p>
        <h2 className="h-display">그래서 박상욱, 쓸 만했을까요?</h2>
        <p className="lead" style={{ margin: "0 0 8px" }}>
          {howIWork.closing[0]} {howIWork.closing[1]}
        </p>
        <dl className="result-board" aria-label="한눈에 보기">
          <div><dt>화면</dt><dd>React · Next.js · RN</dd></div>
          <div><dt>서버</dt><dd>Spring Boot · NestJS</dd></div>
          <div><dt>배포</dt><dd>AWS · Docker · Actions</dd></div>
          <div><dt>품질</dt><dd>Playwright 10회 연속 성공</dd></div>
          <div><dt>운영</dt><dd>14개 언어 · 9개월</dd></div>
          <div><dt>AI</dt><dd>직접 써보고 팀에 공유</dd></div>
        </dl>
        <ul className="intro-points" style={{ textAlign: "left", margin: "0 0 8px" }}>
          {howIWork.habits.map((h) => (
            <li key={h.t}>
              <b>{h.t}</b>
              <span>{h.d}</span>
            </li>
          ))}
        </ul>
        {/* 채움 1 + 외곽 1. 나머지 두 가지는 아래 작은 링크로 내린다. */}
        <div className="result-actions">
          <a className="btn btn-orange" href={`mailto:${profile.email}`}>메일 보내기</a>
          <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div className="result-links">
          <button type="button" onClick={replay}>다시 보기</button>
          <a href={profile.source} target="_blank" rel="noreferrer">이 사이트 소스 보기</a>
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
