import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { resolveCamera, CAMERA, TOUR } from "@/experience/scene/camera";
import { SECTIONS } from "@/experience/state/experience-store";

const pos = new THREE.Vector3();
const look = new THREE.Vector3();

describe("resolveCamera", () => {
  test("섹션 시작점은 그 섹션의 키프레임과 같다", () => {
    SECTIONS.forEach((id, i) => {
      if (id === "studio") return;
      resolveCamera(SECTIONS, i, pos, look);
      expect(pos.toArray().map((v) => +v.toFixed(5))).toEqual(CAMERA[id].pos);
    });
  });

  test("같은 timeline 값은 항상 같은 카메라를 준다 (순수 함수 · 역방향 안전)", () => {
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (const t of [0.2, 1.9, 2.5, 3.77, 4.1, 4.55, 4.9, 6.3, 7.99]) {
      const f1 = resolveCamera(SECTIONS, t, a, look);
      const f2 = resolveCamera(SECTIONS, t, b, look);
      expect(a.equals(b)).toBe(true);
      expect(f1).toBe(f2);
    }
  });

  test("timeline 이 연속이면 카메라도 연속이다 (점프 없음)", () => {
    const prev = new THREE.Vector3();
    resolveCamera(SECTIONS, 0, prev, look);
    for (let t = 0.01; t <= SECTIONS.length - 1; t += 0.01) {
      resolveCamera(SECTIONS, t, pos, look);
      expect(pos.distanceTo(prev)).toBeLessThan(0.25);
      prev.copy(pos);
    }
  });

  test("스튜디오 투어는 마지막 정거장에 실제로 도달한다", () => {
    const i = SECTIONS.indexOf("studio");
    resolveCamera(SECTIONS, i + 0.8, pos, look);
    expect(pos.toArray().map((v) => +v.toFixed(3))).toEqual(TOUR[TOUR.length - 1].pos);
  });

  test("범위를 벗어난 timeline 도 안전하다", () => {
    expect(() => resolveCamera(SECTIONS, -3, pos, look)).not.toThrow();
    expect(() => resolveCamera(SECTIONS, 99, pos, look)).not.toThrow();
    expect(Number.isFinite(pos.x)).toBe(true);
  });
});
