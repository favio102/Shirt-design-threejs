import React from "react";
import { CustomButton } from "./CustomButton";
import { AIStyles } from "../config/constants";

export const AIPicker = ({
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
        id="ai-prompt"
        aria-label="AI prompt"
        aria-invalid={!!error}
        aria-describedby={error ? "ai-prompt-error" : undefined}
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
              className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border transition-colors ${
                active
                  ? "bg-gray-800 text-white border-gray-800 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                  : "bg-white/40 text-gray-700 border-gray-300 hover:bg-white/60 dark:bg-white/10 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-white/20"
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
              className="text-[10px] md:text-xs px-2 py-0.5 rounded-full border bg-white/30 text-gray-700 border-gray-300 hover:bg-white/60 max-w-[80px] md:max-w-[110px] truncate dark:bg-white/5 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-white/15"
            >
              {p}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p id="ai-prompt-error" role="alert" className="text-xs md:text-sm text-red-600 dark:text-red-400 break-words">{error}</p>
      )}
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-xs md:text-sm text-gray-700 dark:text-neutral-200">Generating {progress}%</p>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded overflow-hidden">
              <div
                className="h-full bg-gray-800 dark:bg-neutral-100 transition-all duration-200"
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
              customStyles="text-xs md:text-sm"
            />

            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit("full")}
              customStyles="text-xs md:text-sm"
            />
          </>
        )}
      </div>
    </div>
  );
};

