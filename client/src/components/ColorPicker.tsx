import React from "react";
import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import { state } from "../store";

const PRESET_COLORS = [
  "#EFBD48", // mustard (default)
  "#80C670", // mint
  "#726DE8", // violet
  "#2CCCE4", // cyan
  "#FF8A65", // coral
  "#7098DA", // sky
  "#C19277", // tan
  "#353934", // charcoal
  "#FFFFFF", // white
  "#000000", // black
];

export const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center pb-2 md:absolute md:inset-x-auto md:bottom-auto md:left-full md:ml-3 md:pb-0 md:block">
      <SketchPicker
        color={snap.color}
        disableAlpha
        presetColors={PRESET_COLORS}
        onChange={(color) => (state.color = color.hex)}
      />
    </div>
  );
};

