import { proxy, subscribe } from "valtio";

const STORAGE_KEY = "shirt-designer-state";
const THEME_KEY = "shirt-designer-theme";

const loadInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

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
  viewRotation: 0,
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

  // Drop the seed default lion if it's sitting alongside custom logos —
  // happens with state saved before addLogo learned to dedupe.
  if (Array.isArray(data.logos) && data.logos.length > 1) {
    data.logos = data.logos.filter((l) => l.id !== "default");
  }

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

// Hold the persisted state aside so the home screen renders the default
// preview. The user's saved design is applied only when they click
// "Customize it" via enterCustomizer().
let pendingPersisted = loadPersisted();
export const state = proxy({
  ...defaultState,
  intro: true,
  theme: loadInitialTheme(),
});

export const toggleTheme = () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, state.theme);
  } catch {}
};

export const enterCustomizer = () => {
  if (!state.intro) return;
  if (pendingPersisted) {
    Object.assign(state, { ...pendingPersisted, intro: false });
    pendingPersisted = null;
  } else {
    state.intro = false;
  }
};

// Debounce localStorage writes so that high-frequency mutations
// (color-picker drags, etc.) don't stringify-and-write per tick.
const PERSIST_DEBOUNCE_MS = 300;
let persistTimer: ReturnType<typeof setTimeout> | null = null;

const persistNow = () => {
  if (state.isDragging) return;
  try {
    const {
      intro: _intro,
      isDragging: _isDragging,
      theme: _theme,
      ...rest
    } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Quota exceeded or storage disabled — fail silently.
  }
};

subscribe(state, () => {
  if (state.isDragging) return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(persistNow, PERSIST_DEBOUNCE_MS);
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
  // Drop the seed default lion the first time the user adds a custom logo.
  if (state.logos.length === 1 && state.logos[0].id === "default") {
    state.logos.splice(0, 1);
  }
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

export const rotateView = (deltaRadians: number) => {
  state.viewRotation += deltaRadians;
};
