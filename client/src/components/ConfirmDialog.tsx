import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  content: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  content,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    confirmRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-content"
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-sm w-full p-5 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-base font-bold text-gray-900 dark:text-neutral-100 mb-2"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-content"
          className="text-sm text-gray-700 dark:text-neutral-300 mb-4"
        >
          {content}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn-fx px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="btn-fx px-3 py-1.5 rounded-md text-sm bg-gray-800 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-gray-900 dark:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
