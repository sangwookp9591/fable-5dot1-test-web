"use client";

import { create } from "zustand";

/** 스크롤로 이동하는 experience 상태. spec §21 의 state machine. */
export const SECTIONS = [
  "intro",
  "career",
  "zivo",
  "loop",
  "studio",
  "ai",
  "review",
  "result",
] as const;
export type SectionId = (typeof SECTIONS)[number];

export type Capabilities = {
  webgl: boolean;
  reducedMotion: boolean;
  /** coarse pointer + narrow viewport → DOM 중심 모바일 경험 */
  mobile: boolean;
  /** WebM alpha(VP9) 재생 가능 여부. false 면 HEVC mov 또는 WebP 로 fallback */
  webmAlpha: boolean;
  hevcAlpha: boolean;
  saveData: boolean;
};

type ExperienceState = {
  /** 인트로에서 [바로 보기] 를 눌렀는지. 누르면 모니터가 켜지고 스크롤 안내가 나온다. */
  started: boolean;
  section: SectionId;
  caps: Capabilities;
  soundOn: boolean;
  /** Three.js 로딩/실행 실패 → 정적 배경으로 대체 */
  sceneFailed: boolean;
  /** 고치는 과정 섹션의 현재 단계 (모니터 화면과 동기화) */
  loopStep: number;
  setLoopStep: (n: number) => void;
  start: () => void;
  setSection: (s: SectionId) => void;
  setCaps: (c: Partial<Capabilities>) => void;
  toggleSound: () => void;
  failScene: () => void;
};

export const useExperience = create<ExperienceState>((set) => ({
  started: false,
  section: "intro",
  caps: { webgl: true, reducedMotion: false, mobile: false, webmAlpha: true, hevcAlpha: false, saveData: false },
  soundOn: false,
  sceneFailed: false,
  loopStep: 0,
  setLoopStep: (loopStep) => set((s) => (s.loopStep === loopStep ? s : { loopStep })),
  start: () => set({ started: true }),
  setSection: (section) => set((s) => (s.section === section ? s : { section })),
  setCaps: (c) => set((s) => ({ caps: { ...s.caps, ...c } })),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  failScene: () => set({ sceneFailed: true }),
}));

/**
 * 60fps 로 바뀌는 연속 값은 React state 에 넣지 않는다.
 * ScrollTrigger 가 여기에 쓰고, R3F useFrame / rAF 소비자가 읽는다.
 */
export const progress = {
  /** 전체 페이지 진행도 0..1 */
  global: 0,
  /** 현재 섹션 내부 진행도 0..1 */
  local: 0,
  /** 섹션별 내부 진행도 (위로 지나간 섹션은 1, 아래에 있는 섹션은 0) */
  locals: Object.fromEntries(SECTIONS.map((s) => [s, 0])) as Record<SectionId, number>,
  /** 섹션 인덱스 + local (예: 2.4 = zivo 40%) */
  timeline: 0,
  /** 포인터 정규화 좌표 -1..1 (화면 중심 기준) */
  pointerX: 0,
  pointerY: 0,
  /** 스크롤 속도(px/s) — 빠른 스크롤 시 무거운 갱신을 건너뛰는 용도 */
  velocity: 0,
};
