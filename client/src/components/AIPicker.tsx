import React from "react";
import CustomButton from "./CustomButton";
import { AIStyles } from "../config/constants";

const AIPicker = ({
  prompt,
  setPrompt,
  generatingImg,
  handleSubmit,
  error,
  style,
  setStyle,
  history,
  progress,
}) => {
  const showHistory = !prompt && history && history.length > 0;
  return (
    <div className="aipicker-container">
      <textarea
        placeholder="Ask AI..."
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-1">
        {AIStyles.map((s) => {
          const active = style === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStyle(active ? "" : s.key)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                active
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white/40 text-gray-700 border-gray-300 hover:bg-white/60"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {showHistory && (
        <div className="flex flex-wrap gap-1">
          {history.slice(0, 3).map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(p)}
              title={p}
              className="text-[10px] px-2 py-0.5 rounded-full border bg-white/30 text-gray-600 border-gray-300 hover:bg-white/60 max-w-[80px] truncate"
            >
              {p}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 break-words">{error}</p>
      )}
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-xs text-gray-700">Generating {progress}%</p>
            <div className="w-full h-1.5 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-gray-800 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit("logo")}
              customStyles="text-xs"
            />

            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit("full")}
              customStyles="text-xs"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;
