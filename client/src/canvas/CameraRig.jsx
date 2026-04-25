import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((rootState, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }

    // set model camera position
    easing.damp3(rootState.camera.position, targetPosition, 0.25, delta);

    // hold rotation steady while the user is dragging a decal
    const targetRotation = snap.isDragging
      ? [group.current.rotation.x, group.current.rotation.y, 0]
      : [rootState.pointer.y / 10, -rootState.pointer.x / 5, 0];

    easing.dampE(group.current.rotation, targetRotation, 0.25, delta);
  });

  return <group ref={group} name="camera-rig">{children}</group>;
};

export default CameraRig;