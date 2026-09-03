/**
 * 3D 월드 좌표 → 화면 좌표 앵커. Canvas 안의 <Anchor/> 가 매 프레임 기록하고,
 * DOM 오버레이(아잉)가 rAF 로 읽는다. React state 를 거치지 않는다.
 */
export type Anchor = {
  /** 발 위치(px, 뷰포트 기준) */
  x: number;
  y: number;
  /** 월드 height 가 화면에서 차지하는 px */
  h: number;
  ok: boolean;
};

export const anchors: Record<string, Anchor> = {};
