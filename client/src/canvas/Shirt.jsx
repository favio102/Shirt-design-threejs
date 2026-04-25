import React, { useRef } from "react";
import { Vector3 } from "three";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import state from "../store";

const HIT_RADIUS = 0.2;

const Shirt = () => {
  const snap = useSnapshot(state);
  // TODO(#7): support multiple garment types — read from snap.garment, swap GLB
  // path + mesh name (e.g. "T_Shirt_male" → "Hoodie_male"). Needs hoodie/tank/
  // polo GLBs in /public. See README "Roadmap".
  const { nodes, materials } = useGLTF("/shirt_baked.glb", true);
  const fullTexture = useTexture(snap.fullDecal);
  const logoTextures = useTexture(snap.logos.map((l) => l.map));

  // useTexture returns a single texture for a single-element array; normalize.
  const logoTextureList = Array.isArray(logoTextures)
    ? logoTextures
    : [logoTextures];

  const draggingId = useRef(null);

  useFrame((rootState, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  );

  const findHitLogo = (localPoint) => {
    let closest = null;
    let closestDist = HIT_RADIUS;
    for (const l of snap.logos) {
      const d = localPoint.distanceTo(new Vector3(...l.position));
      if (d < closestDist) {
        closestDist = d;
        closest = l;
      }
    }
    return closest;
  };

  const handlePointerDown = (e) => {
    if (!snap.isLogoTexture || snap.logos.length === 0) return;
    const local = e.eventObject.worldToLocal(e.point.clone());
    const hit = findHitLogo(local);
    if (!hit) return;

    e.stopPropagation();
    draggingId.current = hit.id;
    state.activeLogoId = hit.id;
    state.isDragging = true;
    e.target.setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!draggingId.current) return;
    e.stopPropagation();
    const local = e.eventObject.worldToLocal(e.point.clone());
    const logo = state.logos.find((l) => l.id === draggingId.current);
    if (logo) logo.position = [local.x, local.y, local.z];
  };

  const endDrag = (e) => {
    if (!draggingId.current) return;
    draggingId.current = null;
    state.isDragging = false;
    e.target.releasePointerCapture?.(e.pointerId);
    document.body.style.cursor = "";
  };

  // Force remount only when decal images change, not on every position tick.
  const decalKey = `${snap.logos.map((l) => l.map).join("|")}::${snap.fullDecal}`;

  return (
    <group key={decalKey}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {snap.isLogoTexture &&
          snap.logos.map((logo, i) => (
            <Decal
              key={logo.id}
              position={logo.position}
              rotation={logo.rotation}
              scale={logo.scale}
              map={logoTextureList[i]}
              anisotropy={16}
              depthTest={false}
              depthWrite={true}
            />
          ))}
      </mesh>
    </group>
  );
};

useGLTF.preload("/shirt_baked.glb");

export default Shirt;
