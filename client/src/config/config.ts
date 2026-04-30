// Image generation runs as a Vercel Function at /api/image (see
// client/api/image.js). Same-origin, so no CORS and no env var needed.
//
// If you ever switch to a standalone backend (e.g. the Express version in
// server/), set VITE_BACKEND_URL to the absolute URL of that endpoint and
// the client will use it instead.
const imageUrl = import.meta.env.VITE_BACKEND_URL || "/api/image";

export const config = {
  backendUrl: imageUrl,
};
