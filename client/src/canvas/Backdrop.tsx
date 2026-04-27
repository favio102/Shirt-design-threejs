import React, { useRef } from "react";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "../store";

export const Backdrop = () => {
  const shadows = useRef();
  const snap = useSnapshot(state);
  const isDark = snap.theme === "dark";

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      color={isDark ? "#ffffff" : "#000000"}
      opacity={isDark ? 0.35 : 0.5}
      scale={5}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
      // to adjust color
        intensity={1.75}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
      // to adjust color
        intensity={1.75}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};

