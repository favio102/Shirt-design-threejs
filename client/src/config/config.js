const fallbackByMode = {
  development: "http://localhost:8080/api/v1/dalle",
  production: "https://devswag.onrender.com/api/v1/dalle",
};

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  fallbackByMode[import.meta.env.MODE] ||
  fallbackByMode.development;

export default { backendUrl };
