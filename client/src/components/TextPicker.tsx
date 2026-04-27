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
    <div className="textpicker-container gap-2 md:gap-3">
      <div>
        <label
          htmlFor="text-content"
          className="block text-xs md:text-sm font-medium text-gray-900 dark:text-neutral-100 mb-1"
        >
          Text
        </label>
        <input
          id="text-content"
          type="text"
          placeholder="Type your text…"
          value={options.text}
          maxLength={32}
          onChange={(e) => update({ text: e.target.value })}
          className="textpicker-input"
        />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <label
            htmlFor="text-font"
            className="block text-xs font-medium text-gray-800 dark:text-neutral-200 mb-1"
          >
            Font
          </label>
          <select
            id="text-font"
            value={options.font}
            onChange={(e) => update({ font: e.target.value })}
            className="w-full text-xs md:text-sm px-2 py-1.5 rounded border border-gray-300 bg-white text-gray-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="text-color"
            className="block text-xs font-medium text-gray-800 dark:text-neutral-200 mb-1"
          >
            Color
          </label>
          <input
            id="text-color"
            type="color"
            value={options.color}
            onChange={(e) => update({ color: e.target.value })}
            className="w-9 h-9 cursor-pointer rounded border border-gray-300 dark:border-neutral-600 p-0 bg-transparent"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="rounded border border-gray-300 dark:border-neutral-600 bg-neutral-300 dark:bg-neutral-400 px-2 py-1.5 flex items-center justify-center min-h-[40px] overflow-hidden"
      >
        <span
          className="truncate text-base md:text-lg font-bold"
          style={{ fontFamily: options.font, color: options.color }}
        >
          {options.text || "Preview"}
        </span>
      </div>

      <div className="mt-auto flex gap-2">
        <CustomButton
          type="outline"
          title="Clear"
          handleClick={() => update({ text: "" })}
          customStyles="text-xs md:text-sm"
        />
        <CustomButton
          type="outline"
          title="As logo"
          handleClick={() => applyText("logo")}
          customStyles="text-xs md:text-sm"
        />
        <CustomButton
          type="filled"
          title="As full"
          handleClick={() => applyText("full")}
          customStyles="text-xs md:text-sm"
        />
      </div>
    </div>
  );
};
