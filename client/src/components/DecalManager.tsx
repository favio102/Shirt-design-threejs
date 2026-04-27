import React from "react";
import { useSnapshot } from "valtio";
import state, { removeLogo, updateActiveLogo } from "../store";

export const DecalManager = () => {
  const snap = useSnapshot(state);
  const active = snap.logos.find((l) => l.id === snap.activeLogoId);

  return (
    <div className="decalmanager-container">
      <p className="text-[10px] font-bold text-gray-700">Logos</p>
      {snap.logos.length === 0 ? (
        <p className="text-[10px] text-gray-700 mt-1">
          No logos yet. Add one with the file, AI, or text picker.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1 mt-1">
          {snap.logos.map((l) => {
            const isActive = l.id === snap.activeLogoId;
            return (
              <div key={l.id} className="relative">
                <button
                  type="button"
                  aria-label="Select this logo"
                  aria-pressed={isActive}
                  onClick={() => (state.activeLogoId = l.id)}
                  className={`w-8 h-8 rounded border bg-white/60 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                    isActive ? "border-gray-800" : "border-gray-300"
                  }`}
                >
                  <img
                    src={l.map}
                    alt="Saved logo preview"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removeLogo(l.id)}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] leading-none flex items-center justify-center"
                  aria-label="Remove logo"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {active && (
        <>
          <label
            htmlFor="logo-rotation"
            className="text-[10px] font-bold text-gray-700 mt-2"
          >
            Rotation
          </label>
          <input
            id="logo-rotation"
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={active.rotation[2]}
            onChange={(e) =>
              updateActiveLogo({
                rotation: [
                  active.rotation[0],
                  active.rotation[1],
                  Number(e.target.value),
                ],
              })
            }
            className="w-full"
          />
          <label
            htmlFor="logo-scale"
            className="text-[10px] font-bold text-gray-700"
          >
            Scale
          </label>
          <input
            id="logo-scale"
            type="range"
            min={0.05}
            max={0.4}
            step={0.005}
            value={active.scale}
            onChange={(e) =>
              updateActiveLogo({ scale: Number(e.target.value) })
            }
            className="w-full"
          />
        </>
      )}
    </div>
  );
};

