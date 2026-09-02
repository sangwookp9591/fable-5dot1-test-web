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
          <div className="cards">
            {ai.cards.map((c, i) => (
              <div key={c.t} className={`card reveal ${step >= 1 ? "on" : ""}`} style={{ ["--i" as string]: i }}>
                <b>{c.t}</b>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
          <div className="chips" aria-label="순서">
            {ai.loop.map((l, i) => (
              <span key={l} className={step >= 2 || i === 0 ? "on" : ""} style={{ transitionDelay: `${i * 80}ms` }}>
                {l}
              </span>
            ))}
          </div>
          <div className="site-note">
            <b>{ai.thisSite.t}</b>
            {ai.thisSite.d}
          </div>
        </div>
      </div>
    </Section>
  );
}
