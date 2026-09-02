"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import { progress, useExperience, SECTIONS } from "@/experience/state/experience-store";
import { useScreenTexture } from "./Screen";

/* 재사용 재질 (색만 다른 MeshStandardMaterial 을 컴포넌트마다 새로 만들지 않기) */
function useMats() {
  return useMemo(() => {
    const m = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });
    return {
      floor: m("#cfae7a", { roughness: 0.9 }),
      rug: m("#e6ddd0"),
      wall: m("#f4eee3"),
      wallDark: m("#e9e1d3"),
      wood: m("#a8794d"),
      woodDark: m("#7a5636"),
      metal: m("#9aa3ad", { roughness: 0.4, metalness: 0.4 }),
      dark: m("#1f2733", { roughness: 0.6 }),
      paper: m("#fbfaf7"),
      ink: m("#17243a"),
      orange: m("#ff641e"),
      blue: m("#2458e6"),
      green: m("#198660"),
      aing: m("#8fc3e6"),
      leaf: m("#4f8a5b", { roughness: 0.7 }),
      pot: m("#c96f4a"),
      mug: m("#fff5ea"),
      glass: new THREE.MeshStandardMaterial({ color: "#dff1ff", emissive: "#bfe3ff", emissiveIntensity: 0.6, roughness: 0.2 }),
      lampShade: m("#f2c98d", { emissive: "#ffb36b", emissiveIntensity: 0.35 }),
      led: new THREE.MeshStandardMaterial({ color: "#2cd67a", emissive: "#2cd67a", emissiveIntensity: 1.2 }),
      ledOff: new THREE.MeshStandardMaterial({ color: "#3a4358", emissive: "#3a4358", emissiveIntensity: 0.2 }),
    };
  }, []);
}

function Monitor({ mats }: { mats: ReturnType<typeof useMats> }) {
  const tex = useScreenTexture();
  const started = useExperience((s) => s.started);
  const screenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: tex, emissive: "#ffffff", emissiveMap: tex, emissiveIntensity: 0.9, roughness: 0.35 }),
    [tex],
  );
  screenMat.emissiveIntensity = started ? 0.9 : 0.15;
  return (
    <group position={[-0.3, 0.755, -1.45]}>
      {/* 스탠드 */}
      <mesh material={mats.metal} position={[0, 0.02, 0.05]}>
        <cylinderGeometry args={[0.12, 0.14, 0.02, 24]} />
      </mesh>
      <mesh material={mats.metal} position={[0, 0.12, 0.03]}>
        <boxGeometry args={[0.05, 0.22, 0.03]} />
      </mesh>
      {/* 베젤 */}
      <RoundedBox args={[0.68, 0.42, 0.03]} radius={0.012} position={[0, 0.4, 0]} material={mats.dark} />
      {/* 화면 */}
      <mesh position={[0, 0.405, 0.017]} material={screenMat}>
        <planeGeometry args={[0.62, 0.35]} />
      </mesh>
      {/* 화면 빛이 책상에 비침 */}
      <pointLight position={[0, 0.4, 0.3]} intensity={started ? 0.5 : 0} distance={1.6} color="#e8f0ff" />
    </group>
  );
}

function Laptop({ mats }: { mats: ReturnType<typeof useMats> }) {
  return (
    <group position={[0.62, 0.755, -1.1]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[0.34, 0.016, 0.24]} radius={0.006} position={[0, 0.008, 0]} material={mats.metal} />
      <group position={[0, 0.016, -0.12]} rotation={[-1.25, 0, 0]}>
        <RoundedBox args={[0.34, 0.22, 0.01]} radius={0.006} position={[0, 0.11, 0]} material={mats.metal} />
        <mesh position={[0, 0.11, 0.006]}>
          <planeGeometry args={[0.31, 0.19]} />
          <meshStandardMaterial color="#fbfaf7" emissive="#fbfaf7" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.06, 0.15, 0.007]}>
          <planeGeometry args={[0.12, 0.05]} />
          <meshStandardMaterial color="#ff641e" emissive="#ff641e" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function Lamp({ mats }: { mats: ReturnType<typeof useMats> }) {
  const light = useRef<THREE.PointLight>(null);
  const head = useRef<THREE.Group>(null);
  const reduced = useExperience((s) => s.caps.reducedMotion);
  useFrame(() => {
    if (reduced) return;
    // 포인터를 따라 아주 살짝 (spec §12: subtle)
    const tx = progress.pointerX * 0.04;
    const ty = progress.pointerY * 0.02;
    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(light.current.position.x, 0.05 + tx, 4, 0.016);
      light.current.position.y = THREE.MathUtils.damp(light.current.position.y, 0.5 - ty, 4, 0.016);
    }
    if (head.current) head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, -0.6 + progress.pointerX * 0.06, 4, 0.016);
  });
  return (
    <group position={[-0.95, 0.755, -1.55]}>
      <mesh material={mats.dark} position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.02, 24]} />
      </mesh>
      <mesh material={mats.dark} position={[0.06, 0.3, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 12]} />
      </mesh>
      <group ref={head} position={[0.17, 0.57, 0]} rotation={[0, 0, -0.6]}>
        <mesh material={mats.lampShade}>
          <coneGeometry args={[0.11, 0.16, 24, 1, true]} />
        </mesh>
      </group>
      <pointLight ref={light} position={[0.05, 0.5, 0.1]} intensity={1.1} distance={2.6} decay={2} color="#ffb36b" />
    </group>
  );
}

function Plant({ mats }: { mats: ReturnType<typeof useMats> }) {
  return (
    <group position={[-1.75, 0, -1.95]}>
      <mesh material={mats.pot} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.4, 20]} />
      </mesh>
      <mesh material={mats.leaf} position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.26, 18, 14]} />
      </mesh>
      <mesh material={mats.leaf} position={[0.16, 0.85, 0.05]}>
        <sphereGeometry args={[0.2, 18, 14]} />
      </mesh>
      <mesh material={mats.leaf} position={[-0.17, 0.82, -0.08]}>
        <sphereGeometry args={[0.18, 18, 14]} />
      </mesh>
    </group>
  );
}

/** 벽 보드: 경력 4줄. career 섹션 진행에 따라 줄이 채워진다 */
function WallBoard({ mats }: { mats: ReturnType<typeof useMats> }) {
  const rows = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    const t = progress.locals.career;
    rows.current.forEach((m, i) => {
      if (!m) return;
      const on = t >= [0.12, 0.3, 0.48, 0.66][i];
      const target = on ? 1 : 0.15;
      m.scale.x = THREE.MathUtils.damp(m.scale.x, target, 6, 0.016);
    });
  });
  const colors = [mats.orange, mats.blue, mats.green, mats.ink];
  return (
    <group position={[1.15, 1.45, -2.47]}>
      <RoundedBox args={[1.1, 0.72, 0.03]} radius={0.01} material={mats.paper} />
      <RoundedBox args={[1.14, 0.76, 0.02]} radius={0.01} position={[0, 0, -0.01]} material={mats.woodDark} />
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-0.45, 0.24 - i * 0.16, 0.02]}>
          <mesh material={mats.dark} position={[0.06, 0, 0]}>
            <boxGeometry args={[0.12, 0.05, 0.005]} />
          </mesh>
          <mesh
            ref={(m) => {
              if (m) rows.current[i] = m;
            }}
            material={colors[i]}
            position={[0.2, 0, 0]}
            scale={[0.15, 1, 1]}
          >
            <boxGeometry args={[0.7, 0.05, 0.005]} />
            {/* scale 기준점을 왼쒽으로 */}
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** 벽걸이 화면: 백오피스 157 화면 — 격자 타일 */
function WallScreen({ mats }: { mats: ReturnType<typeof useMats> }) {
  const tiles = useMemo(() => {
    const arr: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) arr.push([c, r]);
    return arr;
  }, []);
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    // studio 투어 2번째 정거장 근처에서 타일이 차례로 켜진다
    const t = progress.locals.studio;
    const k = Math.min(1, Math.max(0, (t - 0.25) / 0.25));
    grp.current?.children.forEach((m, i) => {
      const on = i / tiles.length < k;
      (m as THREE.Mesh).scale.setScalar(THREE.MathUtils.damp((m as THREE.Mesh).scale.x, on ? 1 : 0.001, 8, 0.016));
    });
  });
  return (
    <group position={[-1.85, 1.45, -2.47]}>
      <RoundedBox args={[1.2, 0.7, 0.04]} radius={0.01} material={mats.dark} />
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[1.12, 0.62]} />
        <meshStandardMaterial color="#1b2233" emissive="#22304a" emissiveIntensity={0.5} />
      </mesh>
      <group ref={grp} position={[-0.48, 0.22, 0.024]}>
        {tiles.map(([c, r], i) => (
          <mesh key={i} position={[c * 0.16, -r * 0.15, 0]} scale={0.001}>
            <planeGeometry args={[0.13, 0.11]} />
            <meshStandardMaterial color={i % 5 === 0 ? "#ff641e" : "#8fc3e6"} emissive={i % 5 === 0 ? "#ff641e" : "#8fc3e6"} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** 선반 + 피규어(AI 도구들) + 미니 서버(API/Worker/Batch 분리) */
function Shelf({ mats }: { mats: ReturnType<typeof useMats> }) {
  const leds = useRef<THREE.Mesh[]>([]);
  const blocks = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    // 서버: 투어 3번째 정거장에서 한 덩어리 → 세 덩어리
    const t = progress.locals.studio;
    const k = Math.min(1, Math.max(0, (t - 0.5) / 0.22));
    blocks.current.forEach((b, i) => {
      if (!b) return;
      const targetY = 0.08 + i * (0.09 + 0.06 * k);
      b.position.y = THREE.MathUtils.damp(b.position.y, targetY, 6, 0.016);
    });
    leds.current.forEach((l, i) => {
      if (!l) return;
      l.material = k > 0.5 || i === 0 ? mats.led : mats.ledOff;
    });
  });
  const figs = ["#2458e6", "#ff641e", "#198660", "#8fc3e6", "#17243a"];
  return (
    <group position={[2.35, 0, -2.3]}>
      {/* 선반 2단 */}
      {[1.35, 0.95].map((y) => (
        <mesh key={y} material={mats.wood} position={[0, y, 0]}>
          <boxGeometry args={[0.9, 0.03, 0.28]} />
        </mesh>
      ))}
      {/* 피규어 */}
      {figs.map((c, i) => (
        <mesh key={c} position={[-0.32 + i * 0.16, 1.35 + 0.08, 0.02]}>
          <capsuleGeometry args={[0.04, 0.08, 6, 12]} />
          <meshStandardMaterial color={c} roughness={0.6} />
        </mesh>
      ))}
      {/* 책 몇 권 */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={[mats.orange, mats.blue, mats.paper][i]} position={[-0.3 + i * 0.07, 0.95 + 0.1, 0.02]} rotation={[0, 0, i === 2 ? 0.15 : 0]}>
          <boxGeometry args={[0.05, 0.2, 0.16]} />
        </mesh>
      ))}
      {/* 미니 서버 랙 */}
      <group position={[0.05, 0, 0.05]}>
        <mesh material={mats.dark} position={[0, 0.03, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.34]} />
        </mesh>
        {["API", "Worker", "Batch"].map((n, i) => (
          <mesh
            key={n}
            ref={(m) => {
              if (m) blocks.current[i] = m;
            }}
            material={i === 0 ? mats.blue : i === 1 ? mats.green : mats.orange}
            position={[0, 0.08 + i * 0.09, 0]}
          >
            <boxGeometry args={[0.46, 0.08, 0.3]} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(m) => {
              if (m) leds.current[i] = m;
            }}
            material={mats.ledOff}
            position={[0.18, 0.08 + i * 0.09, 0.16]}
          >
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Poster() {
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
    <group position={[2.97, 1.6, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Room() {
  const mats = useMats();
  const mobile = useExperience((s) => s.caps.mobile);
  const dpr = useThree((s) => s.viewport.dpr);
  void dpr;
  return (
    <group>
      {/* 바닥 · 러그 */}
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]}>
        <planeGeometry args={[6.2, 5.2]} />
      </mesh>
      <mesh material={mats.rug} rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.005, -0.7]}>
        <circleGeometry args={[1.5, 40]} />
      </mesh>
      {/* 뒷벽 · 왼벽(창문) · 오른벽 */}
      <mesh material={mats.wall} position={[0, 1.5, -2.5]}>
        <planeGeometry args={[6.2, 3]} />
      </mesh>
      <mesh material={mats.wallDark} position={[-3.1, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 3]} />
      </mesh>
      <mesh material={mats.wallDark} position={[3.1, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 3]} />
      </mesh>
      {/* 창문 (왼벽) */}
      <group position={[-3.08, 1.65, -0.9]} rotation={[0, Math.PI / 2, 0]}>
        <RoundedBox args={[1.5, 1.2, 0.06]} radius={0.01} material={mats.paper} />
        <mesh position={[0, 0, 0.035]} material={mats.glass}>
          <planeGeometry args={[1.36, 1.06]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={mats.paper}>
          <boxGeometry args={[0.04, 1.06, 0.01]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={mats.paper}>
          <boxGeometry args={[1.36, 0.04, 0.01]} />
        </mesh>
      </group>
      {/* 책상 */}
      <group position={[0, 0, -1.2]}>
        <RoundedBox args={[2.1, 0.05, 0.85]} radius={0.01} position={[0, 0.73, 0]} material={mats.wood} />
        {[-0.95, 0.95].map((x) =>
          [-0.35, 0.35].map((z) => (
            <mesh key={`${x}${z}`} material={mats.woodDark} position={[x, 0.355, z]}>
              <boxGeometry args={[0.06, 0.71, 0.06]} />
            </mesh>
          )),
        )}
      </group>
      <Monitor mats={mats} />
      <Laptop mats={mats} />
      <Lamp mats={mats} />
      {/* 머그 */}
      <mesh material={mats.mug} position={[0.15, 0.8, -0.9]}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />
      </mesh>
      {/* 의자 */}
      <group position={[-0.25, 0, -0.55]}>
        <mesh material={mats.dark} position={[0, 0.46, 0]}>
          <boxGeometry args={[0.46, 0.05, 0.46]} />
        </mesh>
        <mesh material={mats.dark} position={[0, 0.72, -0.2]}>
          <boxGeometry args={[0.44, 0.5, 0.05]} />
        </mesh>
        <mesh material={mats.metal} position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.46, 12]} />
        </mesh>
        <mesh material={mats.metal} position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 20]} />
        </mesh>
      </group>
      {/* 아잉 자리 (쿠션) */}
      <mesh material={mats.aing} position={[1.35, 0.06, -0.35]}>
        <cylinderGeometry args={[0.3, 0.32, 0.12, 28]} />
      </mesh>
      <Plant mats={mats} />
      <WallBoard mats={mats} />
      <WallScreen mats={mats} />
      <Shelf mats={mats} />
      <Poster />
      {/* 접촉 그림자만 (shadow map 없이) */}
      {!mobile ? <ContactShadows position={[0, 0.01, -1]} opacity={0.35} scale={6} blur={2.4} far={2} frames={1} resolution={512} /> : null}
    </group>
  );
}
