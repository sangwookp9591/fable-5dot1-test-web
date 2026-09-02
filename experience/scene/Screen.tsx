"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useExperience } from "@/experience/state/experience-store";
import { zivo, quality, career } from "@/experience/content/portfolio";

/**
 * 책상 모니터 화면. DOM 대신 2D canvas 텍스처에 그린다 (섹션이 바뀔 때만 다시 그림).
 * 실제 콘텐츠와 연결: 섹션별로 지금 설명 중인 내용을 보여준다.
 */
export function useScreenTexture(): THREE.CanvasTexture {
  const section = useExperience((s) => s.section);
  const started = useExperience((s) => s.started);
  const invalidate = useThree((s) => s.invalidate);

  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas, tex };
  }, []);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const font = (w: number, s: number) => `${w} ${s}px "Pretendard Variable", Pretendard, system-ui, sans-serif`;

    if (!started && section === "intro") {
      // 꺼진 모니터: 살짝 반사되는 짙은 남색
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#1b2233");
      g.addColorStop(1, "#0f1522");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      tex.needsUpdate = true;
      invalidate();
      return;
    }

    ctx.fillStyle = "#fbfaf7";
    ctx.fillRect(0, 0, W, H);
    // 상단 바
    ctx.fillStyle = "#f1f0ec";
    ctx.fillRect(0, 0, W, 44);
    ctx.fillStyle = "#ff5f57"; ctx.beginPath(); ctx.arc(24, 22, 7, 0, 7); ctx.fill();
    ctx.fillStyle = "#febc2e"; ctx.beginPath(); ctx.arc(48, 22, 7, 0, 7); ctx.fill();
    ctx.fillStyle = "#28c840"; ctx.beginPath(); ctx.arc(72, 22, 7, 0, 7); ctx.fill();
    ctx.fillStyle = "#677084";
    ctx.font = font(600, 16);
    ctx.textBaseline = "middle";
    ctx.fillText("ai-ng.co.kr", W / 2 - 40, 22);

    ctx.fillStyle = "#17243a";
    ctx.textBaseline = "alphabetic";
    const lines: { t: string; c?: string; w?: number; s?: number }[] = [];
    switch (section) {
      case "intro":
        lines.push({ t: "박상욱 · Portfolio", w: 800, s: 34 }, { t: "그래서 뭐 만들었냐고요?", w: 600, s: 24, c: "#677084" }, { t: "바로 보여드릴게요.", w: 600, s: 24, c: "#677084" });
        break;
      case "career":
        career.items.forEach((c) => lines.push({ t: `${c.years}  ${c.company}`, w: 700, s: 24 }));
        break;
      case "zivo":
        lines.push({ t: "zivo.app", w: 800, s: 30 });
        lines.push({ t: zivo.i18n.langs.slice(0, 7).map((l) => "/" + l).join("  "), w: 700, s: 22, c: "#2458e6" });
        lines.push({ t: zivo.i18n.langs.slice(7).map((l) => "/" + l).join("  "), w: 700, s: 22, c: "#2458e6" });
        lines.push({ t: "14개 언어 · 색인과 캐시 분리", w: 600, s: 20, c: "#677084" });
        break;
      case "loop":
        ctx.fillStyle = "#131a2a";
        ctx.fillRect(0, 44, W, H - 44);
        quality.steps[0].terminal.forEach((l) => lines.push({ t: l, w: 500, s: 22, c: l.startsWith("✗") ? "#ff7b72" : l.startsWith("✓") ? "#57d38c" : "#dfe6f3" }));
        break;
      case "studio":
        lines.push({ t: "ZIVO · 이용자용 웹", w: 800, s: 30 }, { t: "병원 · 택시 · 호텔 · eSIM · QR 주문", w: 600, s: 22, c: "#677084" }, { t: "앱 설치 없이 결제까지", w: 700, s: 24, c: "#ff641e" });
        break;
      case "ai":
        lines.push({ t: "Claude · GPT · Gemini · Grok", w: 800, s: 28 }, { t: "같은 작업을 던져보고 비교", w: 600, s: 22, c: "#677084" });
        break;
      case "review":
        lines.push({ t: "self review", w: 800, s: 30 }, { t: "✓ 구조  ✓ 화면  ✓ 인터랙션", w: 700, s: 22, c: "#198660" }, { t: "✓ 영상  ~ 성능  ✓ 접근성", w: 700, s: 22, c: "#198660" });
        break;
      case "result":
        lines.push({ t: "Thank you", w: 800, s: 34 }, { t: "sangwookp9591@gmail.com", w: 600, s: 22, c: "#677084" });
        break;
    }
    let y = 96;
    for (const l of lines) {
      ctx.fillStyle = l.c ?? (section === "loop" ? "#dfe6f3" : "#17243a");
      ctx.font = font(l.w ?? 600, l.s ?? 22);
      ctx.fillText(l.t, 32, y);
      y += (l.s ?? 22) * 1.6;
    }
    tex.needsUpdate = true;
    invalidate();
  }, [section, started, canvas, tex, invalidate]);

  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}
