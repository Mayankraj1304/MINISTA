const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function normalizeApiBaseUrl(url) {
  return url?.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:3000/api" : ""),
);

export function assertApiConfigured() {
  if (!API_BASE_URL) {
    throw new Error(
      "Production API URL is missing. Set VITE_API_BASE_URL to your deployed backend URL ending in /api.",
    );
  }
}

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message?.includes("Production API URL is missing")) {
    return error.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Confirm VITE_API_BASE_URL points to the deployed backend /api URL and FRONTEND_URL exactly matches this frontend origin.";
  }

  return error.message || fallback;
}
