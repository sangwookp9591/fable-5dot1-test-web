"use client";

import { useEffect, useRef } from "react";
import { Section } from "./Section";
import { quality, aingLines } from "@/experience/content/portfolio";
import { useSteps } from "@/experience/timeline/useSectionProgress";
import { cueAing } from "@/experience/mascot/AingController";
import type { AingState } from "@/experience/mascot/states";
import { useExperience } from "@/experience/state/experience-store";

const THRESH = [0.28, 0.52, 0.76] as const;

function lineClass(s: string) {
  if (s.startsWith("✓")) return "ok";
  if (s.startsWith("✗") || s.includes("failed") && !s.includes("0 failed")) return "bad";
  if (s.startsWith("+")) return "add";
  if (s.startsWith("-")) return "del";
  if (s.startsWith("→") || s.startsWith("$")) return "dim";
  return "";
}

export function WorkLoop() {
  const step = useSteps("loop", THRESH); // 0..3
  const cur = quality.steps[step];
  const prev = useRef(-1);
  const setLoopStep = useExperience((s) => s.setLoopStep);

  useEffect(() => {
    setLoopStep(step);
    if (prev.current === step) return;
    prev.current = step;
    const lines = [aingLines.loop.plan, aingLines.loop.check, aingLines.loop.fix, aingLines.loop.rerun];
    cueAing({ state: cur.aing as AingState, line: lines[step], hold: 2400 });
  }, [step, cur.aing, setLoopStep]);

  return (
    <Section id="loop" label="테스트를 고치는 과정">
      <div className="kr loop-layout">
        <div className="panel loop-left">
          <p className="eyebrow">{quality.eyebrow}</p>
          <h2 className="h-section">{quality.title}</h2>
          <p className="lead">{quality.body}</p>
          <div className="terminal" role="log" aria-live="polite" aria-label="테스트 실행 결과">
            <div className="terminal-bar" aria-hidden="true"><i /><i /><i /></div>
            <div className="terminal-title" aria-hidden="true">e2e · payment</div>
            <div key={cur.id}>
              {cur.terminal.map((l, i) => (
                <span key={i} className={`ln ${lineClass(l)}`} style={{ ["--i" as string]: i }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="panel loop-right">
          <ol className="steps" aria-label="단계">
            {quality.steps.map((s, i) => (
              <li key={s.id} className={`step ${i < step ? "done" : i === step ? "now" : "todo"}`} aria-current={i === step ? "step" : undefined}>
                <span className="k" aria-hidden="true">{i < step ? "✓" : s.k.slice(0, 2)}</span>
                <div>
                  <div className="t">{s.k} · {s.t}</div>
                  <div className="d">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
