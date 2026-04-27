import React from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";
import { getContrastingColor } from "../config/helpers";

type Props = {
  tab: { name: string; label: string; icon: string };
  isFilterTab?: boolean;
  isActiveTab?: boolean;
  handleClick?: () => void;
};

export const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }: Props) => {
  const snap = useSnapshot(state);

  const activeStyles =
    isFilterTab && isActiveTab
      ? {
          backgroundColor: snap.color,
          opacity: 0.7,
          outline: `2px solid ${getContrastingColor(snap.color)}`,
          outlineOffset: "2px",
        }
      : { opacity: 1 };

  return (
    <button
      type="button"
      key={tab.name}
      data-tooltip={tab.label}
      aria-label={tab.label}
      aria-pressed={isFilterTab ? !!isActiveTab : undefined}
      className={`tab-btn tooltip-top ${
        isFilterTab ? "rounded-full glassmorphism" : "rounded-4"
      }`}
      onClick={handleClick}
      style={activeStyles}
    >
      <img
        src={tab.icon}
        alt=""
        width={24}
        height={24}
        className={`${
          isFilterTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12 object-contain"
        }`}
      />
    </button>
  );
};

