import React from "react";
import state from "../store";
import { useSnapshot } from "valtio";
import { getContrastingColor } from "../config/helpers";

type Props = {
  type: "filled" | "outline";
  title: string;
  customStyles?: string;
  handleClick?: () => void;
};

export const CustomButton = ({ type, title, customStyles, handleClick }: Props) => {
  const snap = useSnapshot(state);

  const generateStyle = (type: string) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color,
        color: snap.color,
      };
    }
  };

  return (
    <button
      type="button"
      className={`px-2 py-1.5 flex-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

