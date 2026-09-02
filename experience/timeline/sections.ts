import type { SectionId } from "@/experience/state/experience-store";
import type { AingState } from "@/experience/mascot/states";

/**
 * 섹션 정의. 스크롤 길이는 vh 단위. 카메라 키프레임은 scene/camera.ts 의 CAMERA[id].
 * 하나의 긴 페이지 안에서 각 섹션이 sticky 로 고정되고, 내부 진행도(local 0..1)로 연출한다.
 */
export type SectionDef = {
  id: SectionId;
  /** 섹션이 차지하는 스크롤 높이(vh). 100 = 화면 한 장, 그 이상이면 sticky 연출 구간 */
  length: number;
  /** 섹션 진입 시 아잉 기본 상태 */
  aing: AingState;
  label: string;
};

export const sectionDefs: readonly SectionDef[] = [
  { id: "intro", length: 100, aing: "enter", label: "시작" },
  { id: "career", length: 140, aing: "point", label: "경력" },
  { id: "zivo", length: 220, aing: "idle", label: "ZIVO" },
  { id: "loop", length: 280, aing: "type", label: "고치는 과정" },
  { id: "studio", length: 260, aing: "idle", label: "스튜디오" },
  { id: "ai", length: 130, aing: "think", label: "AI" },
  { id: "review", length: 130, aing: "review", label: "검수" },
  { id: "result", length: 120, aing: "celebrate", label: "결과" },
];

export const sectionIndex = Object.fromEntries(sectionDefs.map((s, i) => [s.id, i])) as Record<SectionId, number>;
