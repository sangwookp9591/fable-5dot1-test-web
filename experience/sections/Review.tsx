"use client";

import { useEffect, useRef } from "react";
import { Section } from "./Section";
import { useExperience } from "@/experience/state/experience-store";
import { useLiveVitals } from "@/experience/performance/useLiveVitals";
import { cueAing } from "@/experience/mascot/AingController";
import { useSteps } from "@/experience/timeline/useSectionProgress";

/** 이 사이트를 만들면서 실제로 돈 검수. 결과는 docs/fable-experiment/09-final-review.md 와 같다. */
export const REVIEW_ITEMS = [
  { k: "구조", s: "PASS", d: "experience/ 아래 state · timeline · mascot · scene 으로 나눴습니다. 연출은 전부 스크롤 위치의 함수입니다." },
  { k: "화면", s: "PASS", d: "1440 과 390 에서 섹션마다 스크린샷을 찍고 패널이 잘리는 곳, 겹치는 곳을 고쳤습니다." },
  { k: "인터랙션", s: "PASS", d: "맨 아래에서 맨 위까지 1.5초에 거꾸로 올려도 섹션과 아잉 상태가 제자리로 돌아옵니다." },
  { k: "아잉 영상", s: "PASS", d: "클립 11개, 시작·끝 포즈가 같아 전환에 튐이 없습니다. WebM 이 막히면 MOV, 그것도 막히면 WebP." },
  { k: "Three.js", s: "IMPROVED", d: "처음엔 상자로 만든 가구가 어색했습니다. 실제 가구 모델과 그림자로 바꿨습니다." },
  { k: "성능", s: "TRADE-OFF", d: "3D(258KB) 는 첫 화면 뒤에 따로 받습니다. 대신 방이 0.5초 늦게 나타납니다." },
  { k: "접근성", s: "PASS", d: "키보드로 전부 이동되고, 움직임 줄이기를 켜면 영상과 카메라가 멈춥니다. Lighthouse 접근성 96 → 대비 수정." },
] as const;

export function Review() {
  const section = useExperience((s) => s.section);
  const active = section === "review" || section === "ai" || section === "result";
  const v = useLiveVitals(active);
  const step = useSteps("review", [0.2]);
  const warned = useRef(false);

  const lcpGood = v.lcp !== null && v.lcp < 2000;
  const clsGood = v.cls < 0.05;
  const inpGood = v.inp === null || v.inp < 150;
  const fpsGood = v.fps === null || v.fps >= 50;

  useEffect(() => {
    if (section !== "review" || step < 1) return;
    const bad = (v.lcp !== null && !lcpGood) || !clsGood || !inpGood || (v.fps !== null && !fpsGood);
    if (bad && !warned.current) {
      warned.current = true;
      cueAing({ state: "error", line: "이건 좀 느린데?", section: "review" });
    }
  }, [section, step, v, lcpGood, clsGood, inpGood, fpsGood]);

  return (
    <Section id="review" label="자기 검수">
      <div className="col-left kr review-panel">
        <div className="panel">
          <p className="eyebrow">Self review · 이 사이트 자체</p>
          <h2 className="h-section">다 만들었다고 끝이 아닙니다.</h2>
          <p className="lead">직접 열어봅니다. 버튼도 눌러봅니다. 이상하면 다시 고칩니다. 아래는 이 사이트에 실제로 돌린 검수입니다.</p>
          <ul className="review-board">
            {REVIEW_ITEMS.map((r) => (
              <li key={r.k}>
                <div>
                  {r.k}
                  <small>{r.d}</small>
                </div>
                <span className={`s ${r.s.replace("-", "")}`}>{r.s}</span>
              </li>
            ))}
          </ul>
          <p className="eyebrow" style={{ marginTop: 12, marginBottom: 6 }}>지금 이 브라우저에서 잰 값</p>
          <div className="vitals" role="list">
            <div className={`vital ${v.lcp === null ? "" : lcpGood ? "good" : "warn"}`} role="listitem">
              <div className="k">첫 큰 화면 (LCP)</div>
              <div className="v">{v.lcp === null ? "—" : `${(v.lcp / 1000).toFixed(2)}s`}</div>
            </div>
            <div className={`vital ${clsGood ? "good" : "warn"}`} role="listitem">
              <div className="k">화면 흔들림 (CLS)</div>
              <div className="v">{v.cls.toFixed(3)}</div>
            </div>
            <div className={`vital ${v.inp === null ? "" : inpGood ? "good" : "warn"}`} role="listitem">
              <div className="k">눌렀을 때 반응 (INP)</div>
              <div className="v">{v.inp === null ? "—" : `${v.inp}ms`}</div>
            </div>
            <div className={`vital ${v.fps === null ? "" : fpsGood ? "good" : "warn"}`} role="listitem">
              <div className="k">초당 프레임</div>
              <div className="v">{v.fps ?? "—"}</div>
            </div>
          </div>
          <p className="note" style={{ marginTop: 14 }}>
            <b>목표</b> LCP 2.0초 아래 · CLS 0.05 아래 · INP 150ms 아래 · 컴퓨터에서 60fps. 미치지 못하면 효과를 뺍니다.
          </p>
        </div>
      </div>
    </Section>
  );
}
