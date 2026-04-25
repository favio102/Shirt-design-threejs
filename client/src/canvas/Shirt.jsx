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
  const { nodes, materials } = useGLTF("/shirt_baked.glb", true);
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  const dragging = useRef(false);

  useFrame((rootState, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  );

  const handlePointerDown = (e) => {
    if (!snap.isLogoTexture) return;
    const local = e.eventObject.worldToLocal(e.point.clone());
    const logoPos = new Vector3(...snap.logoPosition);
    if (local.distanceTo(logoPos) > HIT_RADIUS) return;

    e.stopPropagation();
    dragging.current = true;
    state.isDragging = true;
    e.target.setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    e.stopPropagation();
    const local = e.eventObject.worldToLocal(e.point.clone());
    state.logoPosition = [local.x, local.y, local.z];
  };

  const endDrag = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    state.isDragging = false;
    e.target.releasePointerCapture?.(e.pointerId);
    document.body.style.cursor = "";
  };

  // Force remount only when decal images change — position changes must NOT
  // remount the group (would kill the drag mid-frame).
  const decalKey = `${snap.logoDecal}|${snap.fullDecal}`;

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
        {snap.isLogoTexture && (
          <Decal
            position={snap.logoPosition}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

useGLTF.preload("/shirt_baked.glb");

export default Shirt;
