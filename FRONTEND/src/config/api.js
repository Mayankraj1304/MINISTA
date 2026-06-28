const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  configuredApiBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:3000/api" : "/api");

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check the deployed API URL and CORS settings.";
  }

  return error.message || fallback;
}
