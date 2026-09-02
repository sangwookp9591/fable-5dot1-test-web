"use client";

import { Section } from "./Section";
import { ai } from "@/experience/content/portfolio";
import { useSteps } from "@/experience/timeline/useSectionProgress";

export function Ai() {
  const step = useSteps("ai", [0.15, 0.5]);
  return (
    <Section id="ai" label="AI 를 쓰는 방식">
      <div className="col-left kr">
        <div className="panel">
          <p className="eyebrow">{ai.eyebrow}</p>
          <h2 className="h-section">{ai.title}</h2>
          <p className="lead">{ai.body}</p>
          <ul className="ai-list">
            {ai.cards.map((c, i) => (
              <li key={c.t} className={`reveal ${step >= 1 ? "on" : ""}`} style={{ ["--i" as string]: i }}>
                <b>{c.t}</b>
                <p>{c.d}</p>
              </li>
            ))}
          </ul>
          {/* 순서 칩 4개 → 화살표로 이은 한 문장 */}
          <p className="ai-loop">
            {ai.loop.map((l, i) => (
              <span key={l}>
                {i > 0 ? <i aria-hidden="true">→</i> : null}
                {l}
              </span>
            ))}
          </p>
          <div className="site-note">
            <b>{ai.thisSite.t}</b>
            {ai.thisSite.d}
          </div>
        </div>
      </div>
    </Section>
  );
}
