import { proxy, subscribe } from "valtio";

const STORAGE_KEY = "shirt-designer-state";

const defaultState = {
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  isDownload: false,
  logoDecal: "./lion.png",
  fullDecal: "./lion.png",
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
  try {
    const { intro: _intro, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Quota exceeded or storage disabled — fail silently.
  }
});

export default state;
