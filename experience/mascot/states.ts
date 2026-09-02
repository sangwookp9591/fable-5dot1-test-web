/**
 * Aing Overlay Engine — 상태 정의.
 * 모든 클립은 idle 기본 포즈로 시작하고 끝난다(생성 시 start/end 프레임 고정).
 * 그래서 어떤 상태에서 어떤 상태로 바뀌어도 crossfade 만으로 이어진다.
 */
export const AING_STATES = [
  "idle",
  "enter",
  "point",
  "think",
  "type",
  "wait",
  "surprise",
  "celebrate",
  "review",
  "error",
  "leave",
] as const;
export type AingState = (typeof AING_STATES)[number];

export type ClipDef = {
  /** public/aing/<file>.webm | .mov | .webp */
  file: string;
  /** 반복 재생 여부. false 면 끝나고 idle 로 돌아간다 */
  loop: boolean;
  /** 원본 애니메이션 WebP fallback (image/ 폴더 원본에서 변환) */
  fallback: string;
  /** 클립 길이(초) — preload 우선순위와 자동 복귀 타이머용 */
  duration: number;
};

export const clips: Record<AingState, ClipDef> = {
  idle: { file: "00_idle", loop: true, fallback: "idle", duration: 4 },
  enter: { file: "01_enter", loop: false, fallback: "wave", duration: 5 },
  point: { file: "02_point", loop: false, fallback: "wave", duration: 4 },
  think: { file: "03_think", loop: true, fallback: "think", duration: 4 },
  type: { file: "04_type", loop: true, fallback: "type", duration: 5 },
  wait: { file: "05_wait", loop: true, fallback: "idle", duration: 4 },
  surprise: { file: "06_surprise", loop: false, fallback: "jump", duration: 3 },
  celebrate: { file: "07_celebrate", loop: false, fallback: "celebrate", duration: 4 },
  review: { file: "08_review", loop: true, fallback: "think", duration: 4 },
  error: { file: "09_error", loop: false, fallback: "think", duration: 3 },
  leave: { file: "10_goodbye", loop: false, fallback: "wave", duration: 5 },
};

export const AING_BASE = "/aing";
