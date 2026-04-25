import { proxy, subscribe } from "valtio";
import config from "../config/config";

const STORAGE_KEY = "shirt-designer-state";

const DEFAULT_LOGO = {
  id: "default",
  map: "./lion.png",
  position: [0, 0.04, 0.15],
  rotation: [0, 0, 0],
  scale: 0.15,
};

const defaultState = {
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  isDownload: false,
  logos: [{ ...DEFAULT_LOGO }],
  activeLogoId: DEFAULT_LOGO.id,
  fullDecal: "./lion.png",
  isDragging: false,
};

// Convert any pre-multi-decal saved shape (single logoDecal/logoPosition)
// into the new logos array, so existing localStorage entries / shared links
// keep working.
const migrate = (data) => {
  if (!data) return data;
  if (Array.isArray(data.logos)) return data;
  if (data.logoDecal) {
    data.logos = [
      {
        id: "default",
        map: data.logoDecal,
        position: data.logoPosition || [...DEFAULT_LOGO.position],
        rotation: [0, 0, 0],
        scale: 0.15,
      },
    ];
    data.activeLogoId = "default";
  }
  delete data.logoDecal;
  delete data.logoPosition;
  return data;
};

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

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
  Object.assign(state, {
    ...rest,
    logos: [{ ...DEFAULT_LOGO }],
  });
};

const newLogoId = () =>
  `logo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const addLogo = (map, partial = {}) => {
  const id = newLogoId();
  state.logos.push({
    id,
    map,
    position: [...DEFAULT_LOGO.position],
    rotation: [0, 0, 0],
    scale: DEFAULT_LOGO.scale,
    ...partial,
  });
  state.activeLogoId = id;
  return id;
};

export const removeLogo = (id) => {
  const idx = state.logos.findIndex((l) => l.id === id);
  if (idx === -1) return;
  state.logos.splice(idx, 1);
  if (state.activeLogoId === id) {
    state.activeLogoId = state.logos[state.logos.length - 1]?.id || null;
  }
};

export const updateActiveLogo = (patch) => {
  const logo = state.logos.find((l) => l.id === state.activeLogoId);
  if (!logo) return;
  Object.assign(logo, patch);
};

const designId = new URLSearchParams(window.location.search).get("design");
if (designId) {
  fetch(`${config.designsUrl}/${designId}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((d) => {
      const migrated = migrate({ ...d });
      Object.assign(state, {
        color: migrated.color,
        isLogoTexture: migrated.isLogoTexture,
        isFullTexture: migrated.isFullTexture,
        logos: migrated.logos || [{ ...DEFAULT_LOGO }],
        activeLogoId:
          migrated.activeLogoId || migrated.logos?.[0]?.id || DEFAULT_LOGO.id,
        fullDecal: migrated.fullDecal,
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
