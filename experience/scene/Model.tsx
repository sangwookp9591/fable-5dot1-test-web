"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

/** Kenney Furniture Kit (CC0) 모델. 원본은 0.5 스케일이라 2배로 쓰면 미터 단위가 된다. */
export const MODELS = [
  "desk", "chairDesk", "computerScreen", "computerKeyboard", "laptop", "lampSquareTable", "lampRoundFloor",
  "bookcaseOpen", "books", "plantSmall1", "plantSmall2", "pottedPlant", "rugRounded", "televisionModern",
  "cabinetTelevision", "speakerSmall", "radio", "sideTable", "trashcan", "cardboardBoxClosed", "pillow",
  "loungeChair", "kitchenCoffeeMachine",
] as const;
export type ModelName = (typeof MODELS)[number];

export const modelUrl = (n: ModelName) => `/models/${n}.glb`;
export function preloadModels() {
  MODELS.forEach((n) => useGLTF.preload(modelUrl(n)));
}

type Props = { name: ModelName; shadow?: boolean } & Omit<ThreeElements["group"], "children">;

export function Model({ name, shadow = true, ...props }: Props) {
  const { scene } = useGLTF(modelUrl(name));
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = shadow;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "roughness" in mat) mat.roughness = Math.max(mat.roughness, 0.7);
      }
    });
    return c;
  }, [scene, shadow]);
  return (
    <group {...props}>
      <primitive object={obj} />
    </group>
  );
}
