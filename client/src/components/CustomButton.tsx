import React from "react";
import { state } from "../store";
import { useSnapshot } from "valtio";
import { getContrastingColor } from "../config/helpers";

type Props = {
  type: "filled" | "outline";
  title: string;
  icon?: React.ReactNode;
  customStyles?: string;
  handleClick?: () => void;
};

export const CustomButton = ({ type, title, icon, customStyles, handleClick }: Props) => {
  const snap = useSnapshot(state);

  const generateStyle = (type: string) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      };
    } else if (type === "outline") {
      // Border carries the brand color; text/background stay readable
      // regardless of which color the user picks.
      return {
        borderWidth: "1px",
        borderColor: snap.color,
      };
    }
  };

  const outlineClasses =
    type === "outline"
      ? "bg-white/80 text-gray-900 hover:bg-white dark:bg-neutral-800/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
      : "";

  return (
    <button
      type="button"
      className={`btn-fx inline-flex items-center justify-center gap-1.5 px-2 py-1.5 flex-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${outlineClasses} ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
      {title}
    </button>
  );
};

