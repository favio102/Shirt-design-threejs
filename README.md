# Shirt Design — 3D T-Shirt Customizer

A full-stack web app for designing custom T-shirts in a real-time 3D viewer. Pick a color, upload a logo, or generate a texture from a text prompt with OpenAI's DALL·E — then download the result as a PNG.

![Stack](https://img.shields.io/badge/stack-React%20%7C%20Three.js%20%7C%20Express%20%7C%20OpenAI-blue)

## Repo layout

```
.
├── client/   # Vite + React frontend (Three.js scene + UI)
└── server/   # Express API that proxies prompts to OpenAI DALL·E
```

| Folder      | Stack                                                          | Port |
| ----------- | -------------------------------------------------------------- | ---- |
| [`client/`](client/) | React 18, Vite, three.js, @react-three/fiber, valtio, Tailwind, framer-motion | 5173 |
| [`server/`](server/) | Node, Express, OpenAI SDK, dotenv, CORS                                | 8080 |

## Features

- Real-time 3D shirt preview with a baked GLTF model
- Live color picking with eased material transitions
- Upload an image as a **logo** or **full-shirt** decal
- **AI texture generation** from a text prompt (DALL·E)
- Toggle logo / full-shirt decals independently
- Export the current view as a PNG

## Architecture

```
┌──────────────────────────┐         POST /api/v1/dalle        ┌──────────────────────────┐
│  client (Vite + React)   │  ──────────────────────────────►  │  server (Express)        │
│  Three.js scene          │  ◄──────────── base64 PNG ──────  │  OpenAI DALL·E proxy     │
│  valtio state store      │                                   │                          │
└──────────────────────────┘                                   └──────────────────────────┘
```

- The frontend keeps all UI state (`color`, `logoDecal`, `fullDecal`, toggles) in a single [valtio](https://valtio.pmnd.rs) proxy at [client/src/store/index.js](client/src/store/index.js).
- The 3D shirt at [client/src/canvas/Shirt.jsx](client/src/canvas/Shirt.jsx) subscribes to that store and re-renders decals when textures change. Color is eased onto the material every frame.
- The AI picker `POST`s a prompt to `http://localhost:8080/api/v1/dalle`. The server forwards it to OpenAI and returns a base64 image, which becomes a decal texture.

## Quick start

### Prerequisites

- Node.js 18+
- An OpenAI API key (only required for the AI picker)

### 1. Server

```bash
cd server
npm install
echo "OPENAI_API_KEY=sk-..." > .env
npm start
```

Server listens on **http://localhost:8080**.

### 2. Client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Client runs on **http://localhost:5173**. Open it in your browser and click **Customize it**.

## Scripts

### Client ([client/package.json](client/package.json))

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR   |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

### Server ([server/package.json](server/package.json))

| Script      | Description                           |
| ----------- | ------------------------------------- |
| `npm start` | Run the API with `nodemon index.js`   |

## Environment variables

Create `server/.env`:

```env
OPENAI_API_KEY=your_openai_key_here
```

## API

### `POST /api/v1/dalle`

Generates a 1024×1024 image from a text prompt.

**Request**
```json
{ "prompt": "a vibrant tropical jungle pattern" }
```

**Response**
```json
{ "photo": "<base64-encoded PNG>" }
```

The client wraps the response as `data:image/png;base64,...` and assigns it to either `logoDecal` or `fullDecal` in the store.

## Project structure

```
client/
├── public/                  # static assets (shirt_baked.glb, lion.png, …)
└── src/
    ├── App.jsx              # mounts Home + Canvas + Customizer
    ├── canvas/              # three.js scene (Shirt, Backdrop, CameraRig)
    ├── components/          # AIPicker, ColorPicker, FilePicker, Tab, CustomButton
    ├── pages/               # Home, Customizer
    ├── config/              # constants, motion variants, helpers
    └── store/index.js       # valtio proxy state

server/
├── index.js                 # Express app, CORS, JSON body parser
└── routes/
    └── dalle.routes.js      # POST /api/v1/dalle → OpenAI images.generate
```

## Notes

- The shirt model `client/public/shirt_baked.glb` and default logo `client/public/lion.png` are served statically.
- The server's `package.json` lists `mongoose` and `cloudinary` as dependencies, but neither is currently used in code — they can be safely removed if you don't plan to add persistence or asset hosting.
- The Three.js `<Canvas>` is configured with `gl={{ preserveDrawingBuffer: true }}` so the download feature can read pixels back from the canvas ([client/src/canvas/index.jsx:12](client/src/canvas/index.jsx#L12)).
