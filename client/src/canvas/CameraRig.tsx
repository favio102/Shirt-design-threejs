import React, { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "../store";

type Vec3 = [number, number, number];

const CameraRig = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<Group>(null);
  const snap = useSnapshot(state);

  useFrame((rootState, delta) => {
    if (!group.current) return;
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition: Vec3 = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }

    easing.damp3(rootState.camera.position, targetPosition, 0.25, delta);

    const targetRotation: Vec3 = snap.isDragging
      ? [group.current.rotation.x, group.current.rotation.y, 0]
      : [rootState.pointer.y / 10, -rootState.pointer.x / 5, 0];

    easing.dampE(group.current.rotation, targetRotation, 0.25, delta);
  });

  return (
    <group ref={group} name="camera-rig">
      {children}
    </group>
  );
};

export default CameraRig;
