import React, { useRef } from "react";
import { Mesh, MeshLambertMaterial, Vector3, Texture } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { Decal as _Decal, useGLTF, useTexture } from "@react-three/drei";

// Drei's Decal type doesn't expose anisotropy/depthTest/depthWrite as direct
// props, but R3F forwards them to the underlying material. Keep behavior
// identical by widening the prop type.
const Decal = _Decal as any;
import state from "../store";

const HIT_RADIUS = 0.2;

const Shirt = () => {
  const snap = useSnapshot(state);
  // TODO(#7): support multiple garment types — read from snap.garment, swap GLB
  // path + mesh name (e.g. "T_Shirt_male" → "Hoodie_male"). Needs hoodie/tank/
  // polo GLBs in /public. See README "Roadmap".
  const { nodes, materials } = useGLTF("/shirt_baked.glb", true) as any;
  const fullTexture = useTexture(snap.fullDecal) as Texture;

  // useTexture must always be called with at least one URL — passing an empty
  // array crashes Drei's loader. When the user removes every logo we feed it a
  // dummy URL and skip rendering it.
  const logoUrls =
    snap.logos.length > 0 ? snap.logos.map((l) => l.map) : ["./lion.png"];
  const logoTextures = useTexture(logoUrls);
  const logoTextureList: Texture[] = Array.isArray(logoTextures)
    ? (logoTextures as Texture[])
    : [logoTextures as Texture];

  const draggingId = useRef<string | null>(null);

  useFrame((_rootState, delta) =>
    easing.dampC(
      (materials.lambert1 as MeshLambertMaterial).color,
      snap.color,
      0.25,
      delta
    )
  );

  const findHitLogo = (localPoint: Vector3) => {
    let closest: typeof snap.logos[number] | null = null;
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

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!snap.isLogoTexture || snap.logos.length === 0) return;
    const local = e.eventObject.worldToLocal(e.point.clone());
    const hit = findHitLogo(local);
    if (!hit) return;

    e.stopPropagation();
    draggingId.current = hit.id;
    state.activeLogoId = hit.id;
    state.isDragging = true;
    (e.target as Element & { setPointerCapture?: (id: number) => void })
      .setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!draggingId.current) return;
    e.stopPropagation();
    const local = e.eventObject.worldToLocal(e.point.clone());
    const logo = state.logos.find((l) => l.id === draggingId.current);
    if (logo) logo.position = [local.x, local.y, local.z];
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!draggingId.current) return;
    draggingId.current = null;
    state.isDragging = false;
    (e.target as Element & { releasePointerCapture?: (id: number) => void })
      .releasePointerCapture?.(e.pointerId);
    document.body.style.cursor = "";
  };

  const decalKey = `${snap.logos.map((l) => l.map).join("|")}::${snap.fullDecal}`;
  const shirtMesh = nodes.T_Shirt_male as Mesh;

  return (
    <group key={decalKey}>
      <mesh
        castShadow
        geometry={shirtMesh.geometry}
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
