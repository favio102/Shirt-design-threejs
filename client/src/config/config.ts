const DEV_FALLBACK = "http://localhost:8080/api/v1/image";

const imageUrl = import.meta.env.VITE_BACKEND_URL || DEV_FALLBACK;

if (import.meta.env.PROD && !import.meta.env.VITE_BACKEND_URL) {
  // Loud, early signal: a production build with no backend configured will
  // hit localhost and fail. Catch it in the console instead of in the UI.
  console.error(
    "VITE_BACKEND_URL is not set; image generation will not work in production."
  );
}

export const config = {
  backendUrl: imageUrl,
};
