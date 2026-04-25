import { proxy, subscribe } from "valtio";
import config from "../config/config";

const STORAGE_KEY = "shirt-designer-state";

const defaultState = {
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  isDownload: false,
  logoDecal: "./lion.png",
  fullDecal: "./lion.png",
  logoPosition: [0, 0.04, 0.15],
  isDragging: false,
};

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Hydrate from localStorage but always start on the Home screen.
const persisted = loadPersisted();
const state = proxy({
  ...defaultState,
  ...(persisted || {}),
  intro: true,
});

subscribe(state, () => {
  if (state.isDragging) return;
  try {
    const { intro: _intro, isDragging: _isDragging, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Quota exceeded or storage disabled — fail silently.
  }
});

export const resetState = () => {
  const { intro: _intro, ...rest } = defaultState;
  Object.assign(state, rest);
};

const designId = new URLSearchParams(window.location.search).get("design");
if (designId) {
  fetch(`${config.designsUrl}/${designId}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((d) => {
      Object.assign(state, {
        color: d.color,
        isLogoTexture: d.isLogoTexture,
        isFullTexture: d.isFullTexture,
        logoDecal: d.logoDecal,
        fullDecal: d.fullDecal,
        intro: false,
      });
      const url = new URL(window.location);
      url.searchParams.delete("design");
      window.history.replaceState({}, "", url);
    })
    .catch((err) => {
      console.warn("Failed to load shared design:", err);
    });
}

export default state;
