import React from "react";
import { CustomButton } from "./CustomButton";

const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Impact",
  "Verdana",
];

export const TextPicker = ({ options, setOptions, applyText }) => {
  const update = (patch) => setOptions((prev) => ({ ...prev, ...patch }));

  return (
    <div className="textpicker-container">
      <input
        type="text"
        aria-label="Text content"
        placeholder="Type your text…"
        value={options.text}
        maxLength={32}
        onChange={(e) => update({ text: e.target.value })}
        className="textpicker-input"
      />
      <div className="flex items-center gap-2 mt-2">
        <select
          aria-label="Font"
          value={options.font}
          onChange={(e) => update({ font: e.target.value })}
          className="text-xs md:text-sm flex-1 px-2 py-1 rounded border border-gray-300 bg-white text-gray-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </option>
          ))}
        </select>
        <input
          type="color"
          value={options.color}
          onChange={(e) => update({ color: e.target.value })}
          aria-label="Text color"
          className="w-8 h-8 cursor-pointer rounded border border-gray-300 dark:border-neutral-600 p-0"
        />
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => applyText("logo")}
          customStyles="text-xs md:text-sm"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => applyText("full")}
          customStyles="text-xs md:text-sm"
        />
      </div>
    </div>
  );
};

