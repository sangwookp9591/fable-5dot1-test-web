import * as THREE from "three";
import type { SectionId } from "@/experience/state/experience-store";

export type CamKey = { pos: [number, number, number]; look: [number, number, number]; fov?: number };

/** 섹션별 카메라. 이유 없이 날아다니지 않는다: 항상 방 안의 한 오브젝트를 본다. */
export const CAMERA: Record<SectionId, CamKey> = {
  intro: { pos: [1.7, 1.8, 3.1], look: [-1.3, 1.0, -1.9], fov: 42 }, // 방 전체, 책상이 오른쪽
  career: { pos: [0.3, 1.65, 0.5], look: [-1.0, 1.75, -2.47], fov: 40 }, // 벽 보드(책상 위)
  zivo: { pos: [0.55, 1.4, -0.1], look: [-1.0, 1.05, -2.3], fov: 40 }, // 모니터
  loop: { pos: [-0.15, 1.25, -0.85], look: [-0.55, 1.05, -2.3], fov: 38 }, // 모니터 근접
  studio: { pos: [0.7, 1.35, -0.2], look: [0.3, 0.95, -2.2], fov: 42 },
  ai: { pos: [0.3, 1.5, 0.3], look: [1.7, 1.35, -2.3], fov: 40 }, // 책장 피규어
  review: { pos: [-0.6, 1.25, -0.6], look: [-0.2, 0.95, -2.1], fov: 40 }, // 노트북
  result: { pos: [0.3, 2.2, 3.3], look: [0.0, 0.8, -1.6], fov: 46 }, // 방 전체
};

/** 스튜디오 투어: 책상 → 벽 TV → 서버 랙·책장 → 노트북. 콘텐츠 카드가 오른쪽이므로 대상은 화면 왼쪽에 둔다 */
export const TOUR: CamKey[] = [
  { pos: [0.7, 1.35, -0.2], look: [0.3, 0.95, -2.2], fov: 42 },
  { pos: [-0.7, 1.45, -0.2], look: [-1.5, 1.1, -2.3], fov: 40 },
  { pos: [1.3, 1.15, 0.5], look: [3.0, 0.7, -1.9], fov: 40 },
  { pos: [0.7, 1.3, -0.8], look: [0.5, 0.95, -2.1], fov: 38 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

const vA = new THREE.Vector3();
const vB = new THREE.Vector3();

/** timeline(섹션 index + local) → 목표 카메라 (pos, look, fov). 순수 함수라 역스크롤도 정확하다. */
export function resolveCamera(
  sections: readonly SectionId[],
  timeline: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
): number {
  const i = Math.min(sections.length - 1, Math.max(0, Math.floor(timeline)));
  const local = Math.min(1, Math.max(0, timeline - i));
  const id = sections[i];
  const next = sections[i + 1];

  // 섹션 안에서는 그 섹션의 키를 유지하고, 마지막 25% 구간에서 다음 키로 부드럽게 넘어간다.
  const blendStart = 0.75;
  let a: CamKey;
  let b: CamKey | undefined;
  let t = 0;

  if (id === "studio") {
    // 투어: 4 정거장을 local 로 지나간다. 정거장에서 잠시 머무는 느낌을 위해 smoothstep.
    const stops = TOUR.length;
    const seg = local * (stops - 1);
    const k = Math.min(stops - 2, Math.floor(seg));
    a = TOUR[k];
    b = TOUR[k + 1];
    t = smooth(seg - k);
    if (local > blendStart && next) {
      // 마지막 정거장 → 다음 섹션
      const u = smooth((local - blendStart) / (1 - blendStart));
      vA.set(...TOUR[stops - 1].pos);
      vB.set(...CAMERA[next].pos);
      outPos.copy(vA.lerp(vB, u));
      vA.set(...TOUR[stops - 1].look);
      vB.set(...CAMERA[next].look);
      outLook.copy(vA.lerp(vB, u));
      return THREE.MathUtils.lerp(TOUR[stops - 1].fov ?? 40, CAMERA[next].fov ?? 40, u);
    }
  } else {
    a = CAMERA[id];
    if (next && local > blendStart) {
      b = id === "loop" ? TOUR[0] : CAMERA[next];
      t = smooth((local - blendStart) / (1 - blendStart));
    }
  }

  vA.set(...a.pos);
  outPos.copy(b ? vA.lerp(vB.set(...b.pos), t) : vA);
  vA.set(...a.look);
  outLook.copy(b ? vA.lerp(vB.set(...b.look), t) : vA);
  return b ? THREE.MathUtils.lerp(a.fov ?? 40, b.fov ?? 40, t) : a.fov ?? 40;
}
