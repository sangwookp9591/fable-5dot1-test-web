"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { progress, useExperience } from "@/experience/state/experience-store";
import { useScreenTexture } from "./Screen";
import { Model } from "./Model";
import { makePlasterTexture, makeWoodTexture } from "./textures";
import { anchors } from "./anchors";

/*
 * 아잉 스튜디오 — 실제 가구(Kenney Furniture Kit, CC0)로 꾸린 작은 작업실.
 * 좌표(m): 뒷벽 z=-2.5, 왼벽 x=-3.1(창문), 오른벽 x=3.1, 천장 y=3.
 * 콘텐츠 연결: 책상 모니터=ZIVO 웹 / 벽 TV=백오피스 / 벽 보드=경력 / 책장=AI 도구 / 서버 랙=백엔드 분리 / 노트북=여기가게
 */

const S = 2; // Kenney 모델 → 미터

function useMats() {
  return useMemo(() => {
    const m = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...extra });
    return {
      wall: new THREE.MeshStandardMaterial({ map: makePlasterTexture(), color: "#fbf6ec", roughness: 0.95 }),
      floor: new THREE.MeshStandardMaterial({ map: makeWoodTexture(), roughness: 0.75 }),
      ceiling: m("#fbf8f2"),
      trim: m("#f7f2e8"),
      dark: m("#1f2733", { roughness: 0.6 }),
      rack: m("#2b3442", { roughness: 0.5, metalness: 0.2 }),
      paper: m("#fbfaf7"),
      ink: m("#17243a"),
      orange: m("#ff641e"),
      blue: m("#2458e6"),
      green: m("#198660"),
      aing: m("#8fc3e6"),
      woodDark: m("#7a5636"),
      mug: m("#fff5ea", { roughness: 0.5 }),
      glass: new THREE.MeshStandardMaterial({ color: "#e8f4ff", emissive: "#cfe8ff", emissiveIntensity: 0.9, roughness: 0.2 }),
      led: new THREE.MeshStandardMaterial({ color: "#2cd67a", emissive: "#2cd67a", emissiveIntensity: 1.4 }),
      ledOff: new THREE.MeshStandardMaterial({ color: "#3a4358", emissive: "#3a4358", emissiveIntensity: 0.2 }),
    };
  }, []);
}

/** 월드 좌표를 화면 px 로 투영해 anchors 에 기록 (아잉이 실제 자리에 앉는 데 사용) */
function Anchor({ id, feet, height, cutY }: { id: string; feet: [number, number, number]; height: number; cutY?: number }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const toPx = (x: number, y: number, z: number) => {
      v.set(x, y, z).project(camera);
      return { x: ((v.x + 1) / 2) * size.width, y: ((1 - v.y) / 2) * size.height, front: v.z < 1 };
    };
    const f = toPx(...feet);
    const t = toPx(feet[0], feet[1] + height, feet[2]);
    const c = cutY !== undefined ? toPx(feet[0], cutY, feet[2]) : null;
    const a = anchors[id] ?? (anchors[id] = { x: 0, y: 0, h: 0, cut: NaN, ok: false });
    a.x = f.x;
    a.y = f.y;
    a.h = Math.max(0, f.y - t.y);
    a.cut = c ? c.y : NaN;
    a.ok = f.front;
  });
  return null;
}

/** 모니터 화면: Kenney computerScreen 위에 우리 캔버스 텍스처를 덧댄다 */
function MonitorScreen() {
  const tex = useScreenTexture();
  const started = useExperience((s) => s.started);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: tex, emissive: "#ffffff", emissiveMap: tex, emissiveIntensity: 0.9, roughness: 0.3 }),
    [tex],
  );
  mat.emissiveIntensity = started ? 0.95 : 0.12;
  return (
    <group>
      {/* computerScreen(2x): 폭 0.78 · 높이 0.58 · 두께 0.2, 화면은 y 0.16~0.56 쯤 */}
      <mesh position={[0.39, 0.385, -0.018]} material={mat}>
        <planeGeometry args={[0.66, 0.34]} />
      </mesh>
      <pointLight position={[0.39, 0.4, 0.35]} intensity={started ? 0.6 : 0} distance={1.8} color="#e8f0ff" />
    </group>
  );
}

/** 책상 램프 빛: 포인터를 아주 살짝 따라간다 (spec §12) */
function LampLight({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  const reduced = useExperience((s) => s.caps.reducedMotion);
  useFrame(() => {
    if (reduced || !light.current) return;
    light.current.position.x = THREE.MathUtils.damp(light.current.position.x, position[0] + progress.pointerX * 0.05, 4, 0.016);
    light.current.position.z = THREE.MathUtils.damp(light.current.position.z, position[2] + progress.pointerY * 0.03, 4, 0.016);
  });
  return <pointLight ref={light} position={position} intensity={1.3} distance={2.4} decay={2} color="#ffb36b" />;
}

/** 벽 보드: 경력 4줄. career 진행에 따라 줄이 채워진다 */
function WallBoard({ mats }: { mats: ReturnType<typeof useMats> }) {
  const rows = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    const t = progress.locals.career;
    rows.current.forEach((m, i) => {
      if (!m) return;
      const target = t >= [0.12, 0.3, 0.48, 0.66][i] ? 1 : 0.12;
      m.scale.x = THREE.MathUtils.damp(m.scale.x, target, 6, 0.016);
      m.position.x = 0.12 + (0.7 * m.scale.x) / 2; // 라벨 오른쒽에서 시작, 왼쪽 정렬 유지
    });
  });
  const colors = [mats.orange, mats.blue, mats.green, mats.ink];
  return (
    <group position={[-0.3, 1.95, -2.47]}>
      <RoundedBox args={[1.2, 0.68, 0.03]} radius={0.01} material={mats.paper} />
      <RoundedBox args={[1.24, 0.72, 0.02]} radius={0.01} position={[0, 0, -0.01]} material={mats.woodDark} />
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-0.42, 0.22 - i * 0.15, 0.02]}>
          <mesh material={mats.dark} position={[0.02, 0, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.005]} />
          </mesh>
          <mesh
            ref={(m) => {
              if (m) rows.current[i] = m;
            }}
            material={colors[i]}
            position={[0.16, 0, 0.004]}
            scale={[0.12, 1, 1]}
          >
            <boxGeometry args={[0.7, 0.05, 0.005]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** TV 화면 위 타일: 백오피스 157 화면. studio 투어 2번째 정거장에서 켜진다 */
function TvTiles() {
  const tiles = useMemo(() => {
    const arr: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) arr.push([c, r]);
    return arr;
  }, []);
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = progress.locals.studio;
    const k = Math.min(1, Math.max(0, (t - 0.28) / 0.22));
    grp.current?.children.forEach((m, i) => {
      const on = i / tiles.length < k;
      const mesh = m as THREE.Mesh;
      mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, on ? 1 : 0.001, 8, 0.016));
    });
  });
  return (
    <group ref={grp} position={[-0.5, 0.26, 0]}>
      {tiles.map(([c, r], i) => (
        <mesh key={i} position={[c * 0.165, -r * 0.14, 0]} scale={0.001}>
          <planeGeometry args={[0.13, 0.1]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#ff641e" : "#8fc3e6"} emissive={i % 5 === 0 ? "#ff641e" : "#8fc3e6"} emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** 미니 서버 랙: 투어 3번째 정거장에서 한 덩어리 → API/Worker/Batch 세 덩어리 */
function ServerRack({ mats }: { mats: ReturnType<typeof useMats> }) {
  const blocks = useRef<THREE.Mesh[]>([]);
  const leds = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    const t = progress.locals.studio;
    const k = Math.min(1, Math.max(0, (t - 0.52) / 0.2));
    blocks.current.forEach((b, i) => {
      if (!b) return;
      b.position.y = THREE.MathUtils.damp(b.position.y, 0.1 + i * (0.11 + 0.07 * k), 6, 0.016);
    });
    leds.current.forEach((l, i) => {
      if (l) l.material = k > 0.5 || i === 0 ? mats.led : mats.ledOff;
    });
  });
  return (
    <group position={[2.55, 0, -1.25]}>
      <mesh material={mats.dark} position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.06, 0.4]} />
      </mesh>
      {["API", "Worker", "Batch"].map((n, i) => (
        <mesh
          key={n}
          ref={(m) => {
            if (m) blocks.current[i] = m;
          }}
          material={mats.rack}
          position={[0, 0.1 + i * 0.11, 0]}
          castShadow
        >
          <boxGeometry args={[0.46, 0.1, 0.36]} />
          <mesh material={i === 0 ? mats.blue : i === 1 ? mats.green : mats.orange} position={[-0.1, 0, 0.182]}>
            <boxGeometry args={[0.2, 0.025, 0.004]} />
          </mesh>
          <mesh
            ref={(l) => {
              if (l) leds.current[i] = l;
            }}
            material={mats.ledOff}
            position={[0.17, 0, 0.185]}
          >
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

function Poster({ mats }: { mats: ReturnType<typeof useMats> }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 680;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff0e7";
    ctx.fillRect(0, 0, 512, 680);
    ctx.fillStyle = "#17243a";
    ctx.font = "800 64px 'Pretendard Variable', Pretendard, system-ui, sans-serif";
    ctx.fillText("AING", 40, 110);
    ctx.font = "600 28px 'Pretendard Variable', Pretendard, system-ui, sans-serif";
    ctx.fillStyle = "#677084";
    ctx.fillText("studio · 2026", 40, 152);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const img = new Image();
    img.onload = () => {
      const h = 400;
      const w = (img.width / img.height) * h;
      ctx.drawImage(img, (512 - w) / 2, 220, w, h);
      t.needsUpdate = true;
    };
    img.src = "/aing/rest.png";
    return t;
  }, []);
  return (
    <group position={[3.08, 1.7, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[0.66, 0.86, 0.02]} radius={0.005} material={mats.woodDark} position={[0, 0, -0.015]} />
      <mesh>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export function Room({ onReady }: { onReady: () => void }) {
  const mats = useMats();
  const mobile = useExperience((s) => s.caps.mobile);

  return (
    <group>
      {/* ── 방 껍데기 ── */}
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.1]} receiveShadow>
        <planeGeometry args={[6.2, 5.2]} />
      </mesh>
      <mesh material={mats.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0.1]}>
        <planeGeometry args={[6.2, 5.2]} />
      </mesh>
      <mesh material={mats.wall} position={[0, 1.5, -2.5]} receiveShadow>
        <planeGeometry args={[6.2, 3]} />
      </mesh>
      <mesh material={mats.wall} position={[-3.1, 1.5, 0.1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3]} />
      </mesh>
      <mesh material={mats.wall} position={[3.1, 1.5, 0.1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3]} />
      </mesh>
      {/* 걸레받이 */}
      <mesh material={mats.trim} position={[0, 0.05, -2.49]}>
        <boxGeometry args={[6.2, 0.1, 0.02]} />
      </mesh>
      <mesh material={mats.trim} position={[-3.09, 0.05, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.2, 0.1, 0.02]} />
      </mesh>
      <mesh material={mats.trim} position={[3.09, 0.05, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.2, 0.1, 0.02]} />
      </mesh>
      {/* 창문 (왼벽) — 빛이 들어오는 곳 */}
      <group position={[-3.08, 1.7, -0.4]} rotation={[0, Math.PI / 2, 0]}>
        <RoundedBox args={[1.7, 1.3, 0.08]} radius={0.01} material={mats.trim} />
        <mesh position={[0, 0, 0.045]} material={mats.glass}>
          <planeGeometry args={[1.54, 1.14]} />
        </mesh>
        <mesh position={[0, 0, 0.05]} material={mats.trim}>
          <boxGeometry args={[0.04, 1.14, 0.01]} />
        </mesh>
        <mesh position={[0, 0.1, 0.05]} material={mats.trim}>
          <boxGeometry args={[1.54, 0.04, 0.01]} />
        </mesh>
        {/* 창틀 아래 선반 + 작은 식물 */}
        <mesh position={[0, -0.7, 0.1]} material={mats.trim}>
          <boxGeometry args={[1.8, 0.05, 0.22]} />
        </mesh>
      </group>

      <Suspense fallback={null}>
        {/* ── 가구 (Kenney, 2x = m) ── */}
        <Model name="rugRounded" position={[-1.87, 0.002, 0.15]} scale={S} shadow={false} />
        <Model name="desk" position={[-1.03, 0, -1.72]} scale={S} />
        <Model name="chairDesk" position={[-1.75, 0, -1.05]} rotation={[0, Math.PI * 1.25, 0]} scale={S} />
        <group position={[-0.75, 0.76, -2.3]}>
          <Model name="computerScreen" scale={S} />
          <MonitorScreen />
        </group>
        <Model name="computerKeyboard" position={[-0.7, 0.76, -1.8]} scale={S} />
        <Model name="laptop" position={[-0.05, 0.76, -1.85]} rotation={[0, -0.25, 0]} scale={S} />
        <Model name="lampSquareTable" position={[-1.0, 0.76, -2.22]} scale={S} />
        <LampLight position={[-0.88, 1.28, -2.34]} />
        {/* 머그 */}
        <mesh material={mats.mug} position={[0.25, 0.81, -1.95]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />
        </mesh>
        {/* 사이드 테이블 + 커피머신 + 라디오 */}
        <Model name="sideTable" position={[0.62, 0, -2.06]} scale={S} />
        <Model name="kitchenCoffeeMachine" position={[0.72, 0.76, -2.06]} scale={S} />
        <Model name="radio" position={[1.15, 0.76, -2.22]} scale={S} />
        {/* 책장 + 책 + 피규어(AI 도구) + 스피커 */}
        <Model name="bookcaseOpen" position={[1.9, 0, -2.0]} scale={S} />
        <Model name="books" position={[1.98, 0.02, -2.2]} scale={S} />
        <Model name="books" position={[2.3, 0.02, -2.2]} rotation={[0, 0.2, 0]} scale={S} />
        <Model name="books" position={[2.02, 0.86, -2.2]} scale={S} />
        <Model name="speakerSmall" position={[2.4, 0.86, -2.24]} scale={S} />
        <Model name="plantSmall1" position={[2.05, 1.3, -2.25]} scale={S} />
        {["#2458e6", "#ff641e", "#198660", "#8fc3e6"].map((c, i) => (
          <mesh key={c} position={[2.25 + i * 0.12, 1.36, -2.25]} castShadow>
            <capsuleGeometry args={[0.035, 0.07, 6, 12]} />
            <meshStandardMaterial color={c} roughness={0.6} />
          </mesh>
        ))}
        <Model name="cardboardBoxClosed" position={[2.2, 0, -1.55]} rotation={[0, 0.3, 0]} scale={S} />
        <ServerRack mats={mats} />
        {/* TV + 캐비닛 (왼쪽 뒷벽) */}
        <Model name="cabinetTelevision" position={[-2.9, 0, -2.0]} scale={S} />
        <group position={[-2.1, 0.62, -2.28]}>
          <Model name="televisionModern" scale={S} />
          <group position={[0, 0.5, 0.13]}>
            <TvTiles />
          </group>
        </group>
        <Model name="lampRoundFloor" position={[-1.25, 0, -2.2]} scale={S} />
        <Model name="trashcan" position={[-1.3, 0, -1.9]} scale={S} />
        <Model name="pottedPlant" position={[2.85, 0, -1.9]} scale={S} />
        <Model name="plantSmall2" position={[-3.0, 1.05, -0.4]} rotation={[0, 0.4, 0]} scale={S} />
        {/* 아잉 자리: 라운지 체어 + 쿠션 */}
        <Model name="loungeChair" position={[-2.3, 0, 0.9]} rotation={[0, 2.4, 0]} scale={S} />
        <Model name="pillow" position={[-2.05, 0.4, 0.55]} rotation={[0.4, 2.4, 0]} scale={S} />
        <WallBoard mats={mats} />
        <Poster mats={mats} />
        {/* 아잉이 책상 뒤에 앉는 자리 (모니터 오른쪽). 책상 윗면(0.78) 아래는 가려진다 */}
        <Anchor id="deskSeat" feet={[0.25, 0.5, -2.12]} height={0.62} cutY={0.78} />
        <Ready onReady={onReady} />
      </Suspense>
      {mobile ? null : null}
    </group>
  );
}
