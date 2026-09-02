"use client";

import { Section } from "./Section";
import { hero, profile } from "@/experience/content/portfolio";
import { useExperience } from "@/experience/state/experience-store";

export function Intro() {
  const started = useExperience((s) => s.started);
  const start = useExperience((s) => s.start);
  const reduced = useExperience((s) => s.caps.reducedMotion);

  const onStart = () => {
    start();
    // 사용자가 누른 뒤의 한 번짜리 이동. 이후 스크롤은 전부 네이티브.
    document.getElementById("career")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <Section id="intro" label="소개" className="intro">
      <div className="col-left intro-copy kr panel">
        <p className="eyebrow plain">{hero.eyebrow} · {profile.period}</p>
        <h1 className="h-display" id="intro-title">
          {hero.title[0]}
          <br />
          {hero.title[1]}
        </h1>
        {/* 대표 범위 한 줄. 본문보다 진하게 둬서 제목 다음으로 먼저 읽히게 한다. */}
        <p className="intro-summary">{hero.summary}</p>
        <p className="lead">{hero.body}</p>
        <ul className="intro-points">
          {hero.points.map((p) => (
            <li key={p.n}>
              <b>{p.t}</b>
              <span>{p.d}</span>
            </li>
          ))}
        </ul>
        <div className="intro-actions">
          <button type="button" className="btn btn-primary" onClick={onStart} aria-describedby="intro-title">
            {started ? "계속 보기" : hero.cta} <span aria-hidden="true">↓</span>
          </button>
          <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="btn btn-ghost" href={profile.web} target="_blank" rel="noreferrer">
            {profile.webLabel}
          </a>
        </div>
        <p className="intro-name">
          <b>{profile.name}</b> · {profile.roleKr}
        </p>
      </div>
    </Section>
  );
}
