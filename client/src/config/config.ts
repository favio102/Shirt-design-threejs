const fallbackByMode = {
  development: "http://localhost:8080/api/v1/image",
  production: "https://devswag.onrender.com/api/v1/image",
};

const imageUrl =
  import.meta.env.VITE_BACKEND_URL ||
  fallbackByMode[import.meta.env.MODE] ||
  fallbackByMode.development;

export const config = {
  backendUrl: imageUrl,
};
