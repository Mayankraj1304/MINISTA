import axios from "axios";

const API_URL = {
  baseURL: "http://localhost:3000/api/posts/",
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
