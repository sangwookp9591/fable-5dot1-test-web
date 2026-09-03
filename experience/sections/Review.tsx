"use client";

import { useEffect, useRef } from "react";
import { Section } from "./Section";
import { useExperience } from "@/experience/state/experience-store";
import { useLiveVitals } from "@/experience/performance/useLiveVitals";
import { cueAing } from "@/experience/mascot/AingController";
import { useSteps } from "@/experience/timeline/useSectionProgress";

/** 이 사이트를 만들면서 실제로 돌린 검수. */
export const REVIEW_ITEMS = [
  { k: "코드 구조", s: "PASS", d: "state, timeline, mascot, scene 모듈로 분리하고, 화면 연출은 스크롤 위치 기반 순수 함수로 구성했습니다." },
  { k: "화면 대응", s: "PASS", d: "데스크톱(1440px)과 모바일(390px) 환경에서 섹션별 레이아웃 겹침과 글자 잘림 현상을 점검하고 수정했습니다." },
  { k: "스크롤 조작", s: "PASS", d: "스크롤을 빠르게 왕복해도 애니메이션 상태와 카메라 좌표가 어긋나지 않고 제자리로 복귀하도록 처리했습니다." },
  { k: "캐릭터 영상", s: "PASS", d: "11개 영상 클립의 시작과 끝 프레임을 맞춰 전환 시 끊김을 없앴고, 브라우저 환경에 따라 WebM, MOV, WebP 순으로 재생합니다." },
  { k: "3D 공간", s: "IMPROVED", d: "단순 박스 형태의 임시 모델을 실제 가구 모델과 그림자 효과로 교체해 자연스러운 실내 공간을 연출했습니다." },
  { k: "성능 최적화", s: "TRADE-OFF", d: "초기 화면의 빠른 표시를 위해 3D 모델(258KB)은 첫 렌더링 이후 비동기로 로드하도록 분리했습니다." },
  { k: "웹 접근성", s: "PASS", d: "키보드 Tab 키만으로 모든 콘텐츠 탐색이 가능하며, 움직임 줄이기(prefers-reduced-motion) 설정을 지원합니다." },
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
          <p className="eyebrow">이 사이트 자체 점검</p>
          <h2 className="h-section">코드를 작성한 뒤 실제 브라우저 환경에서 검증했습니다.</h2>
          <p className="lead">화면을 직접 열어보고 다양한 기기와 네트워크 환경에서 테스트하며, 어색하거나 지연이 발생하는 부분을 수정했습니다.</p>
          <ul className="review-board">
            {REVIEW_ITEMS.map((r) => (
              <li key={r.k}>
                <div className="r">
                  <span>{r.k}</span>
                  <i className="dots" aria-hidden="true" />
                  <span className={`s ${r.s.replace("-", "")}`}>{r.s}</span>
                </div>
                <small>{r.d}</small>
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
            <b>성능 기준</b> 첫 화면 2.0초 이내 · 레이아웃 흔들림 0.05 이내 · 클릭 반응 150ms 이내 · 60fps 유지. 기준에 미치지 못하는 화려한 효과는 과감히 제외했습니다.
          </p>
        </div>
      </div>
    </Section>
  );
}
