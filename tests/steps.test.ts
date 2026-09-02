import { describe, expect, test } from "bun:test";
import { stepFor, remap, clamp01 } from "@/experience/timeline/useSectionProgress";

describe("stepFor", () => {
  const th = [0.28, 0.52, 0.76] as const;
  test("임계값 전후로 단계가 바뀌고, 앞뒤 어느 방향에서도 같은 값", () => {
    expect(stepFor(0, th)).toBe(0);
    expect(stepFor(0.279, th)).toBe(0);
    expect(stepFor(0.28, th)).toBe(1);
    expect(stepFor(0.6, th)).toBe(2);
    expect(stepFor(1, th)).toBe(3);
    // 역방향
    expect(stepFor(0.75, th)).toBe(2);
    expect(stepFor(0.51, th)).toBe(1);
  });
  test("임계값이 없으면 항상 0", () => {
    expect(stepFor(0.9, [])).toBe(0);
  });
});

describe("remap / clamp01", () => {
  test("구간 매핑과 클램프", () => {
    expect(remap(0.05, 0.05, 0.4)).toBe(0);
    expect(remap(0.4, 0.05, 0.4)).toBe(1);
    expect(remap(0.225, 0.05, 0.4)).toBeCloseTo(0.5);
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
  });
});
