"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clips, type AingState } from "./states";
import { clipUrl, fallbackUrl } from "./preload";
import { useExperience } from "@/experience/state/experience-store";

export type AingOverlayProps = {
  state: AingState;
  /** 캐릭터 발 중심의 화면 좌표. x: vw(0~100), bottom: vh(0~100) */
  x: number;
  bottom: number;
  /** 캐릭터 표시 높이(px). 프레임(720) 대비 캐릭터는 약 80% */
  height: number;
  flip?: boolean;
  /** 책상 뒤 가림 등 depth illusion 용 clip-path */
  clipPath?: string;
  line?: string | null;
  hidden?: boolean;
  /** 앵커 추적 중: 위치 transition 없이 즉시 반영 */
  instant?: boolean;
  onEnded?: (s: AingState) => void;
};

type Buffer = 0 | 1;

/**
 * Aing Overlay Engine.
 * - dual video buffer + opacity crossfade (flash/black frame 없음)
 * - requestVideoFrameCallback 으로 새 클립의 첫 프레임이 그려진 뒤에만 교체
 * - 재생하지 않는 버퍼는 src 를 비워 decode 를 멈춘다
 * - WebM alpha → HEVC alpha(Safari) → 애니메이션 WebP 순서로 fallback
 * - reduced-motion 이면 정지 포스터만
 */
export function AingOverlay({ state, x, bottom, height, flip, clipPath, line, hidden, instant, onEnded }: AingOverlayProps) {
  const caps = useExperience((s) => s.caps);
  const ext: "webm" | "mov" | null = caps.webmAlpha ? "webm" : caps.hevcAlpha ? "mov" : null;
  const useVideo = ext !== null && !caps.reducedMotion;

  const vids = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)] as const;
  const activeRef = useRef<Buffer>(0);
  const [active, setActive] = useState<Buffer>(0);
  const [ready, setReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  // 버퍼별로 "지금 어떤 상태를 로딩 중인지" 기록. 이전 버퍼 정리 타이머가 새 로딩을 죽이지 않게.
  const loading = useRef<[AingState | null, AingState | null]>([null, null]);
  const clearTimer = useRef<number | null>(null);

  // 클립 전환
  useEffect(() => {
    if (!useVideo || videoFailed) return;
    const next: Buffer = activeRef.current === 0 ? 1 : 0;
    const v = vids[next].current;
    if (!v) return;
    let cancelled = false;
    const def = clips[state];
    loading.current[next] = state;
    v.loop = def.loop;
    v.muted = true;
    v.playsInline = true;
    v.src = clipUrl(state, ext);
    v.load();

    const clearInactive = () => {
      // 타이머가 울리는 시점의 비활성 버퍼를, 그 버퍼가 새 클립을 로딩 중이 아닐 때만 비운다
      const idx: Buffer = activeRef.current === 0 ? 1 : 0;
      if (loading.current[idx] !== null) return;
      const p = vids[idx].current;
      if (!p) return;
      p.pause();
      p.removeAttribute("src");
      p.load();
    };

    const swap = () => {
      if (cancelled) return;
      loading.current[next] = null;
      activeRef.current = next;
      setActive(next);
      setReady(true);
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
      clearTimer.current = window.setTimeout(clearInactive, 260); // crossfade 끝난 뒤
    };
    const onCanPlay = () => {
      if (cancelled) return;
      v.play()
        .then(() => {
          if (cancelled) return;
          if ("requestVideoFrameCallback" in v) {
            (v as HTMLVideoElement & { requestVideoFrameCallback: (cb: () => void) => number }).requestVideoFrameCallback(swap);
          } else {
            swap();
          }
        })
        .catch(() => {
          if (!cancelled) setVideoFailed(true);
        });
    };
    const onError = () => {
      if (cancelled) return;
      setVideoFailed(true);
    };
    const onEnd = () => {
      if (cancelled) return;
      onEndedRef.current?.(state);
    };
    v.addEventListener("canplaythrough", onCanPlay, { once: true });
    v.addEventListener("error", onError, { once: true });
    v.addEventListener("ended", onEnd);
    return () => {
      cancelled = true;
      if (loading.current[next] === state) loading.current[next] = null;
      v.removeEventListener("canplaythrough", onCanPlay);
      v.removeEventListener("error", onError);
      v.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, useVideo, videoFailed, ext]);

  // 탭이 숨겨지면 정지, 돌아오면 재생
  useEffect(() => {
    const onVis = () => {
      const v = vids[activeRef.current].current;
      if (!v || !v.src) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이미지 fallback 클립 전환 시 onEnded 흉내 (loop 아닌 상태는 duration 뒤 idle 로)
  useLayoutEffect(() => {
    if (useVideo && !videoFailed) return;
    const def = clips[state];
    if (def.loop) return;
    const t = window.setTimeout(() => onEndedRef.current?.(state), def.duration * 1000);
    return () => window.clearTimeout(t);
  }, [state, useVideo, videoFailed]);

  const showVideo = useVideo && !videoFailed;
  // 프레임 720 중 캐릭터 580 → 컨테이너 높이 = height / 0.805
  const frameH = height / 0.805;

  return (
    <div
      aria-hidden="true"
      className="aing"
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: frameH,
        width: frameH * (16 / 9),
        transform: `translate3d(calc(${x}vw - 50%), ${-bottom}vh, 0) ${flip ? "scaleX(-1)" : ""}`,
        transition: instant
          ? "opacity var(--dur-base) var(--ease-out)"
          : `transform var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out), height var(--dur-slow) var(--ease-out), width var(--dur-slow) var(--ease-out)`,
        opacity: hidden ? 0 : 1,
        clipPath,
        willChange: "transform, opacity",
        contain: "layout paint",
        pointerEvents: "none",
      }}
    >
      {/* 포스터: 첫 프레임 준비 전 / 실패 / reduced-motion */}
      <img
        src={showVideo && ready ? undefined : showVideo || caps.reducedMotion ? "/aing/rest.png" : fallbackUrl(state)}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: "50%",
          bottom: `${(56 / 720) * 100}%`,
          height: "80.5%",
          width: "auto",
          transform: "translateX(-50%)",
          opacity: showVideo && ready ? 0 : 1,
          transition: "opacity var(--dur-fast) var(--ease-out)",
        }}
      />
      {showVideo &&
        ([0, 1] as const).map((i) => (
          <video
            key={i}
            ref={vids[i]}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: ready && active === i ? 1 : 0,
              transition: "opacity 220ms var(--ease-out)",
            }}
          />
        ))}
      {line ? (
        <div
          className="aing-bubble kr"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "calc(80.5% + 8%)",
            transform: `translateX(-50%) ${flip ? "scaleX(-1)" : ""}`,
          }}
        >
          <span key={line} className="aing-bubble-text">
            {line}
          </span>
        </div>
      ) : null}
    </div>
  );
}
