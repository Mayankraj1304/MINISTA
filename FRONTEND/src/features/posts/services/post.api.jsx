import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/posts/`,
  withCredentials: true,
};

export async function getFeeds() {
  try {
    const response = await axios.get(`${API_URL.baseURL}feed`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
