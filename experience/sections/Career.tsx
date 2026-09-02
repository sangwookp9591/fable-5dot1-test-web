"use client";

import { Section } from "./Section";
import { career, quality } from "@/experience/content/portfolio";
import { useSteps } from "@/experience/timeline/useSectionProgress";

const THRESH = [0.12, 0.3, 0.48, 0.66] as const;

export function Career() {
  const step = useSteps("career", THRESH);
  return (
    <Section id="career" label="경력">
      <div className="col-left kr panel">
        <p className="eyebrow">{career.eyebrow}</p>
        <h2 className="h-section">{career.title}</h2>
        <p className="lead">{career.body}</p>
        <ol className="board" aria-label="경력 보드">
          {career.items.map((c, i) => {
            const hist = quality.history.find((h) => h.years.includes(c.company.replace(/[㈜()]/g, "").slice(0, 3)));
            return (
              // 켜진 줄만 탭으로 잡아 상세(.board-more)를 키보드로도 펼칠 수 있게 한다
              <li key={c.company} className={`board-row ${i < step ? "on" : ""}`} tabIndex={i < step ? 0 : undefined} style={{ ["--i" as string]: i }}>
                <div className="board-years">{c.years}</div>
                <div className="board-main">
                  <div className="board-company">{c.company}</div>
                  <div className="board-desc">{c.d}</div>
                  {hist ? (
                    <div className="board-more">
                      <b>{hist.t}</b> {hist.d}
                    </div>
                  ) : null}
                </div>
                <div className="board-tags">
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="board-scope" aria-live="polite">
          {step >= 4 ? "화면 → 앱·영상 → API·AWS → 백오피스·서버. 범위가 이렇게 넓어졌습니다." : "스크롤하면 한 줄씩 채워집니다."}
        </p>
      </div>
    </Section>
  );
}
