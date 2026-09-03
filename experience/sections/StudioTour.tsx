"use client";

import { Section } from "./Section";
import { zivo, yeogigage, profile } from "@/experience/content/portfolio";
import { useSteps } from "@/experience/timeline/useSectionProgress";
import { useExperience } from "@/experience/state/experience-store";

/** 방 안 오브젝트 ↔ 콘텐츠. 카메라 keyframe(scene/camera.ts) 의 tour 구간과 같은 순서. */
export const TOUR_STOPS = [
  {
    id: "desk",
    label: "책상",
    eyebrow: zivo.userWeb.eyebrow,
    title: zivo.userWeb.title,
    body: zivo.userWeb.body,
    points: zivo.userWeb.points.slice(0, 3),
    link: zivo.userWeb.link,
    linkLabel: zivo.userWeb.linkLabel,
  },
  {
    id: "wall",
    label: "벽 화면",
    eyebrow: zivo.backOffice.eyebrow,
    title: zivo.backOffice.title,
    body: zivo.backOffice.body,
    points: zivo.backOffice.points,
    link: zivo.backOffice.link,
    linkLabel: zivo.backOffice.linkLabel,
  },
  {
    id: "server",
    label: "서버 선반",
    eyebrow: zivo.backend.eyebrow,
    title: zivo.backend.title,
    body: zivo.backend.body,
    points: zivo.backend.points,
    link: profile.web,
    linkLabel: "자세한 내용 보기",
  },
  {
    id: "laptop",
    label: "노트북",
    eyebrow: yeogigage.eyebrow,
    title: yeogigage.title,
    body: yeogigage.body,
    points: yeogigage.points,
    link: profile.web,
    linkLabel: "자세한 내용 보기",
  },
] as const;

const THRESH = [0.2, 0.47, 0.73] as const;

export function StudioTour() {
  const step = useSteps("studio", THRESH);
  const stop = TOUR_STOPS[step];
  const reduced = useExperience((s) => s.caps.reducedMotion);

  const jump = (i: number) => {
    const el = document.getElementById("studio");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const usable = el.offsetHeight - window.innerHeight;
    const targets = [0.04, 0.3, 0.57, 0.82];
    window.scrollTo({ top: top + usable * targets[i], behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <Section id="studio" label="스튜디오 둘러보기">
      <div className="col-right kr">
        <div className="panel tour-card">
          <div className="tour-stops" role="tablist" aria-label="둘러볼 곳">
            {TOUR_STOPS.map((s, i) => (
              <button key={s.id} type="button" role="tab" aria-selected={i === step} aria-current={i === step ? "true" : undefined} onClick={() => jump(i)}>
                {s.label}
              </button>
            ))}
          </div>
          <div key={stop.id}>
            <p className="eyebrow">{stop.eyebrow}</p>
            <h2 className="h-section">{stop.title}</h2>
            <p className="lead" style={{ marginBottom: 8 }}>{stop.body}</p>
            <ul className="tour-points">
              {stop.points.map((p) => (
                <li key={p.t}>
                  <b>{p.t}</b>
                  {p.d}
                </li>
              ))}
            </ul>
            {stop.id === "server" ? (
              <div className="split" aria-label="구조 변화">
                <div className="box bad">
                  {zivo.backend.before.t}
                  <small>{zivo.backend.before.sub}</small>
                </div>
                <span aria-hidden="true">→</span>
                <div className="cols">
                  {zivo.backend.after.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </div>
            ) : null}
            {stop.id === "laptop" ? (
              <div className="flow" aria-label="촬영 흐름">
                {yeogigage.flow.map((f, i) => (
                  <span key={f}>
                    {f}
                    {i < yeogigage.flow.length - 1 ? null : null}
                  </span>
                ))}
              </div>
            ) : null}
            {stop.link ? (
              <a className="btn btn-ghost" href={stop.link} target="_blank" rel="noreferrer" style={{ marginTop: 14 }}>
                {stop.linkLabel} ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
