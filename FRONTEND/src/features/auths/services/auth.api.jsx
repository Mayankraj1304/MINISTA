import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/auth/`,
  withCredentials: true,
};

export async function login(username, password) {
  try {
    const response = await axios.post(
      `${API_URL.baseURL}login`,
      {
        username,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function register(username, email, password) {
  try {
    const response = await axios.post(
      `${API_URL.baseURL}register`,
      {
        username,
        email,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await axios.post(
      `${API_URL.baseURL}getme`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
