# 3D T-Shirt Designer

A 3D shirt customization tool built with React, Three.js, and OpenAI's DALL·E. Pick a color, upload an image, or generate a texture from a text prompt — then download the result.

This folder is the **client** (Vite + React). The matching Express API lives in [`../server`](../server).

## Stack

- **React 18** + **Vite 5**
- **three** with **@react-three/fiber** and **@react-three/drei** for the 3D scene and decals
- **valtio** for global state (shirt color, decal textures, UI flags)
- **framer-motion** for UI transitions
- **tailwindcss** for styling
- **maath** easing for smooth color transitions

## Features

- Real-time 3D preview of a baked GLTF shirt model (`public/shirt_baked.glb`)
- **Color picker** — live material color updates via `useFrame` easing
- **File picker** — upload an image as a logo or full-shirt texture
- **AI picker** — generate a texture from a text prompt (calls the server's DALL·E endpoint)
- Toggle logo decal / full-shirt texture independently
- Download the current canvas as a PNG

## Project structure

```
src/
├── App.jsx              # Mounts Home, Canvas, and Customizer together
├── canvas/              # Three.js scene
│   ├── index.jsx        # <Canvas> setup + lighting
│   ├── Shirt.jsx        # GLTF mesh + decals + color easing
│   ├── Backdrop.jsx     # Soft shadow backdrop
│   └── CameraRig.jsx    # Responsive camera positioning
├── components/          # AIPicker, ColorPicker, FilePicker, Tab, CustomButton
├── pages/
│   ├── Home.jsx         # Landing screen
│   └── Customizer.jsx   # Editor + filter tabs
├── config/              # constants, motion variants, helpers
└── store/index.js       # valtio proxy state
```

## Getting started

### Prerequisites

- Node.js 18+
- The companion server running on `http://localhost:8080` (see [`../server`](../server))

### Install & run

```bash
npm install
npm run dev
```

Vite will start the dev server (default `http://localhost:5173`).

### Available scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the Vite dev server with HMR   |
| `npm run build`  | Production build to `dist/`          |
| `npm run preview`| Preview the production build locally |
| `npm run lint`   | Run ESLint                           |

## How it works

State is held in a single valtio proxy ([`src/store/index.js`](src/store/index.js)):

```js
{
  intro: true,           // landing vs. customizer view
  color: "#EFBD48",      // shirt material color
  isLogoTexture: true,   // show the logo decal
  isFullTexture: false,  // show the full-shirt decal
  isDownload: false,
  logoDecal: "./lion.png",
  fullDecal: "./lion.png",
}
```

The `Shirt` component reads this state via `useSnapshot` and re-renders decals when textures change. Color is eased frame-by-frame onto `materials.lambert1.color` using `maath/easing`.

The AI picker `POST`s a prompt to `http://localhost:8080/api/v1/dalle`, receives a base64 PNG back, and assigns it to either `logoDecal` or `fullDecal`.

## Notes

- The shirt model (`public/shirt_baked.glb`) and default logo (`public/lion.png`) are served statically from `public/`.
- The AI features require the server to be running with a valid `OPENAI_API_KEY`.
