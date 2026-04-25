const exportHandlers = { current: null };
const exportViewsHandlers = { current: null };

export const registerExportHandler = (fn) => {
  exportHandlers.current = fn;
  return () => {
    if (exportHandlers.current === fn) exportHandlers.current = null;
  };
};

export const registerExportViewsHandler = (fn) => {
  exportViewsHandlers.current = fn;
  return () => {
    if (exportViewsHandlers.current === fn) exportViewsHandlers.current = null;
  };
};

const triggerDownload = (dataURL, filename) => {
  if (!dataURL) return;
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadCanvasToImage = () => {
  triggerDownload(exportHandlers.current?.(), "shirt-design.png");
};

export const downloadAllViews = () => {
  triggerDownload(exportViewsHandlers.current?.(), "shirt-mockup.png");
};

export const reader = (file) =>
  new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsDataURL(blob);
  });

export const renderTextToDataURL = ({ text, font = "Arial", color = "#000000" }) => {
  const canvas = document.createElement("canvas");
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const family = `"${font}", sans-serif`;
  let fontSize = 240;
  ctx.font = `bold ${fontSize}px ${family}`;
  while (ctx.measureText(text).width > size * 0.9 && fontSize > 24) {
    fontSize -= 8;
    ctx.font = `bold ${fontSize}px ${family}`;
  }

  ctx.fillText(text, size / 2, size / 2);
  return canvas.toDataURL("image/png");
};

const PROMPT_HISTORY_KEY = "shirt-designer-prompt-history";
const MAX_PROMPT_HISTORY = 5;

export const getPromptHistory = () => {
  try {
    const raw = localStorage.getItem(PROMPT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addPromptHistory = (prompt) => {
  const trimmed = prompt.trim();
  if (!trimmed) return getPromptHistory();
  const current = getPromptHistory();
  const next = [trimmed, ...current.filter((p) => p !== trimmed)].slice(
    0,
    MAX_PROMPT_HISTORY
  );
  try {
    localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Quota exceeded or storage disabled — fail silently.
  }
  return next;
};

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};
