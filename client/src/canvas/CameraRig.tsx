import React, { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "../store";

type Vec3 = [number, number, number];

type Breakpoint = "mobile" | "tablet" | "desktop";

const breakpointFromWidth = (w: number): Breakpoint =>
  w <= 600 ? "mobile" : w <= 1260 ? "tablet" : "desktop";

export const CameraRig = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<Group>(null);
  const snap = useSnapshot(state);

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window === "undefined"
      ? "desktop"
      : breakpointFromWidth(window.innerWidth)
  );

  useEffect(() => {
    const onResize = () => setBreakpoint(breakpointFromWidth(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Reusable target buffers — avoid allocating fresh tuples every frame.
  const targetPosition = useRef<Vec3>([0, 0, 2]);
  const targetRotation = useRef<Vec3>([0, 0, 0]);

  useFrame((rootState, delta) => {
    if (!group.current) return;

    const pos = targetPosition.current;
    if (snap.intro) {
      if (breakpoint === "mobile") {
        pos[0] = 0;
        pos[1] = 0.2;
        pos[2] = 2.5;
      } else if (breakpoint === "tablet") {
        pos[0] = 0;
        pos[1] = 0;
        pos[2] = 2;
      } else {
        pos[0] = -0.4;
        pos[1] = 0;
        pos[2] = 2;
      }
    } else if (breakpoint === "mobile") {
      pos[0] = 0;
      pos[1] = 0;
      pos[2] = 2.5;
    } else {
      pos[0] = 0;
      pos[1] = 0;
      pos[2] = 2;
    }

    easing.damp3(rootState.camera.position, pos, 0.25, delta);

    const rot = targetRotation.current;
    if (snap.isDragging) {
      rot[0] = group.current.rotation.x;
      rot[1] = group.current.rotation.y;
      rot[2] = 0;
    } else {
      rot[0] = rootState.pointer.y / 10;
      rot[1] = -rootState.pointer.x / 5 + snap.viewRotation;
      rot[2] = 0;
    }

    easing.dampE(group.current.rotation, rot, 0.25, delta);
  });

  return (
    <group ref={group} name="camera-rig">
      {children}
    </group>
  );
};
