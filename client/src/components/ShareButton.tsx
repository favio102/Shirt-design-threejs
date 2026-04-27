import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";
import config from "../config/config";
import { CustomButton } from "./CustomButton";

type ShareState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "ready"; url: string }
  | { status: "error"; error: string };

export const ShareButton = () => {
  const snap = useSnapshot(state);
  const [share, setShare] = useState<ShareState>({ status: "idle" });

  const handleShare = async () => {
    setShare({ status: "saving" });
    try {
      const res = await fetch(config.designsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: snap.color,
          isLogoTexture: snap.isLogoTexture,
          isFullTexture: snap.isFullTexture,
          logos: snap.logos,
          fullDecal: snap.fullDecal,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShare({
          status: "error",
          error: data?.message || `Save failed (${res.status})`,
        });
        return;
      }
      const url = `${window.location.origin}/?design=${data.id}`;
      setShare({ status: "ready", url });
      navigator.clipboard?.writeText(url).catch(() => {});
    } catch (err) {
      setShare({
        status: "error",
        error: (err as Error)?.message || "Network error — is the server running?",
      });
    }
  };

  const buttonTitle = share.status === "saving" ? "Sharing..." : "Share";

  return (
    <div className="relative">
      <CustomButton
        type="outline"
        title={buttonTitle}
        handleClick={share.status === "saving" ? undefined : handleShare}
        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
      />
      {(share.status === "ready" || share.status === "error") && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-white/95 dark:bg-neutral-800/95 rounded-md shadow-lg text-xs flex flex-col gap-2 z-20">
          {share.status === "ready" ? (
            <>
              <p className="text-gray-700 dark:text-neutral-200">
                Shareable link (copied to clipboard):
              </p>
              <input
                type="text"
                readOnly
                value={share.url}
                onFocus={(e) => e.target.select()}
                className="w-full border border-gray-200 dark:border-neutral-600 rounded p-1 bg-gray-50 dark:bg-neutral-900 dark:text-neutral-100 font-mono"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(share.url)}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-neutral-600 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => setShare({ status: "idle" })}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-neutral-600 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-red-600 dark:text-red-400 break-words">{share.error}</p>
              <button
                type="button"
                onClick={() => setShare({ status: "idle" })}
                className="self-end px-2 py-1 rounded border border-gray-300 dark:border-neutral-600 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

