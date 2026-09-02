"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { zivo } from "@/experience/content/portfolio";
import { useSectionFrame, remap } from "@/experience/timeline/useSectionProgress";
import { cueAing } from "@/experience/mascot/AingController";
import { useExperience } from "@/experience/state/experience-store";

export function Zivo() {
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [phase, setPhase] = useState<0 | 1>(0);
  const [scrollT, setScrollT] = useState(0); // 슬라이더 스크롤 값 (0..1)
  const [userT, setUserT] = useState<number | null>(null);
  const surprised = useRef(false);
  const reduced = useExperience((s) => s.caps.reducedMotion);

  useSectionFrame("zivo", (t) => {
    // Phase A: 숫자 카운트업 (0.05~0.4)
    const a = remap(t, 0.05, 0.4);
    const eased = 1 - Math.pow(1 - a, 3);
    zivo.stats.forEach((s, i) => {
      const el = statRefs.current[i];
      if (el) el.textContent = String(Math.round(s.value * eased));
      barRefs.current[i]?.style.setProperty("--t", eased.toFixed(3));
    });
    // Phase B: 슬라이더 (0.45~0.9)
    const b = remap(t, 0.45, 0.9);
    setScrollT((prev) => (Math.abs(prev - b) < 0.004 ? prev : b));
    setPhase((p) => (t >= 0.42 ? 1 : 0) === p ? p : t >= 0.42 ? 1 : 0);
  });

  // 사용자가 드래그한 값이 있으면 그걸 우선, 스크롤이 더 진행되면 다시 스크롤이 이긴다
  const value = userT === null ? scrollT : Math.max(userT, scrollT);

  useEffect(() => {
    if (value > 0.5 && !surprised.current) {
      surprised.current = true;
      cueAing({ state: "surprise", line: "14개 언어… 이걸 혼자?" });
    }
    if (value < 0.2) surprised.current = false;
  }, [value]);

  const langCount = Math.round(value * zivo.i18n.langs.length);

  return (
    <Section id="zivo" label="ZIVO 에서 만든 것">
      <div className="col-left kr">
        <p className="eyebrow">{zivo.eyebrow}</p>
        <h2 className="h-section">{zivo.title}</h2>
        <p className="lead" style={{ marginBottom: 8 }}>{zivo.body}</p>

        <div className="stats" role="list" aria-label="ZIVO 숫자">
          {zivo.stats.map((s, i) => (
            <div className="stat" role="listitem" key={s.label} ref={(el) => { barRefs.current[i] = el; }}>
              <div className="stat-v">
                <span ref={(el) => { statRefs.current[i] = el; }}>0</span>
                {s.suffix ? <small>{s.suffix}</small> : null}
                <span className="sr-only"> {s.value}{s.suffix}</span>
              </div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        <div className={`i18n ${phase ? "on" : ""}`} aria-live="off">
          <p className="eyebrow" style={{ marginTop: 18 }}>{zivo.i18n.eyebrow}</p>
          <h3 className="h-section" style={{ fontSize: "clamp(18px, 1.9vw, 24px)" }}>{zivo.i18n.title}</h3>
          <p className="lead" style={{ fontSize: 14, marginBottom: 12 }}>{zivo.i18n.body}</p>

          <div className="urlbar" aria-hidden="true">
            <span className="lock">●</span>
            <span>zivo.app</span>
            {value < 0.5 ? (
              <span className="cookie">?lang=cookie</span>
            ) : (
              <span className="lang">/{zivo.i18n.langs[Math.min(zivo.i18n.langs.length - 1, Math.max(0, langCount - 1))]}</span>
            )}
            <span className="dim">/hospital/seoul</span>
          </div>
          <div className="langs" aria-hidden="true">
            {zivo.i18n.langs.map((l, i) => (
              <span key={l} className={i < langCount ? "on" : ""}>/{l}</span>
            ))}
          </div>

          <input
            type="range"
            className="slider"
            min={0}
            max={1000}
            value={Math.round(value * 1000)}
            onChange={(e) => setUserT(Number(e.target.value) / 1000)}
            aria-label="언어 주소 구조 전환: 쿠키 방식에서 URL 방식으로"
            aria-valuetext={value < 0.5 ? zivo.i18n.before.t : zivo.i18n.after.t}
            style={{ ["--t" as string]: value }}
          />
          <div className="slider-labels" aria-hidden="true">
            <span>{zivo.i18n.before.k}</span>
            <span>{zivo.i18n.after.k}</span>
          </div>

          <div className="i18n-track">
            <div className={`i18n-side ${value < 0.5 ? "active" : "dim"}`}>
              <div className="k">{zivo.i18n.before.k}</div>
              <div className="t">{zivo.i18n.before.t}</div>
              <div className="d">{zivo.i18n.before.d}</div>
            </div>
            <div className={`i18n-side ${value >= 0.5 ? "active" : "dim"}`}>
              <div className="k">{zivo.i18n.after.k}</div>
              <div className="t">{zivo.i18n.after.t}</div>
              <div className="d">{zivo.i18n.after.d}</div>
            </div>
          </div>
          <a className="btn btn-ghost" href={zivo.userWeb.link} target="_blank" rel="noreferrer" style={{ marginTop: 6 }}>
            {zivo.userWeb.linkLabel} ↗
          </a>
        </div>
      </div>
      {!reduced ? null : <span className="sr-only">애니메이션이 줄어든 상태입니다.</span>}
    </Section>
  );
}
