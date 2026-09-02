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
  /** 사용자가 직접 끈 값과, 끌던 순간의 스크롤 값 */
  const [drag, setDrag] = useState<{ user: number; scroll: number } | null>(null);
  const surprised = useRef(false);
  const reduced = useExperience((s) => s.caps.reducedMotion);

  // 움직임 줄이기: 스크롤로 숫자를 키우지 않고 최종 값을 바로 보여준다
  useEffect(() => {
    if (!reduced) return;
    zivo.stats.forEach((s, i) => {
      const el = statRefs.current[i];
      if (el) el.textContent = String(s.value);
      barRefs.current[i]?.style.setProperty("--t", "1");
    });
  }, [reduced]);

  useSectionFrame("zivo", (t) => {
    if (reduced) return; // 최종 상태는 위 effect 가 한 번만 그린다
    // Phase A: 숫자 카운트업 (0.05~0.4)
    const a = remap(t, 0.05, 0.4);
    const eased = a >= 0.995 ? 1 : 1 - Math.pow(1 - a, 3);
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

  // 움직임 줄이기면 스크롤을 기다리지 않고 마지막 단계를 바로 보여준다
  const view: 0 | 1 = reduced ? 1 : phase;
  // 스크롤이 멈춰 있는 동안만 드래그한 값이 이긴다. 스크롤이 조금이라도 움직이면 값의 주인은 다시 스크롤.
  const base = reduced ? 1 : scrollT;
  const value = drag && Math.abs(base - drag.scroll) < 0.03 ? drag.user : base;

  useEffect(() => {
    if (value > 0.5 && !surprised.current) {
      surprised.current = true;
      cueAing({ state: "surprise", line: "14개 언어… 이걸 혼자?", section: "zivo" });
    }
    if (value < 0.2) surprised.current = false;
  }, [value]);

  const langCount = Math.round(value * zivo.i18n.langs.length);

  return (
    <Section id="zivo" label="ZIVO 에서 만든 것">
      <div className="col-left kr panel">
        <p className="eyebrow">{zivo.eyebrow}</p>
        <h2 className="h-section">{zivo.title}</h2>
        <p className="lead" style={{ marginBottom: 8 }} hidden={view === 1}>{zivo.body}</p>

        {/* 2단계에서는 감추되 DOM 에는 남긴다 — 스크롤 카운트업이 같은 ref 를 계속 쓴다 */}
        <div className="stats" role="list" aria-label="ZIVO 숫자" hidden={view === 1}>
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

        <p className="lead" style={{ fontSize: 14, margin: "12px 0 0" }} hidden={view === 1}>
          {zivo.quote.t} {zivo.quote.d}
        </p>

        <div className={`i18n ${view ? "on" : ""}`} aria-live="off" hidden={view === 0}>
          <p className="eyebrow">{zivo.i18n.eyebrow}</p>
          <h3 className="h-section">{zivo.i18n.title}</h3>
          <p className="lead" style={{ fontSize: 14, marginBottom: 8 }}>{zivo.i18n.body}</p>

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
            onChange={(e) => setDrag({ user: Number(e.target.value) / 1000, scroll: base })}
            aria-label="언어 주소 구조 전환: 쿠키 방식에서 URL 방식으로"
            aria-valuetext={value < 0.5 ? zivo.i18n.before.t : zivo.i18n.after.t}
            style={{ ["--t" as string]: value }}
          />
          {/* 비교 카드 2개 대신 한 줄 캡션 */}
          <p className="i18n-cap">
            {zivo.i18n.caption.before}
            <i aria-hidden="true">→</i>
            <b>{zivo.i18n.caption.after}</b>
          </p>
          <a className="btn btn-ghost" href={zivo.userWeb.link} target="_blank" rel="noreferrer" style={{ marginTop: 6 }}>
            {zivo.userWeb.linkLabel} ↗
          </a>
        </div>
      </div>
      {!reduced ? null : <span className="sr-only">애니메이션이 줄어든 상태입니다.</span>}
    </Section>
  );
}
