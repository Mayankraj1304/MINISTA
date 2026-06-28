import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/auth/`,
  withCredentials: true,
};

export async function login(username, password) {
  const response = await axios.post(
    `${API_URL.baseURL}login`,
    {
      username,
      password,
    },
    { withCredentials: true },
  );
  return response.data;
}

export async function register(username, email, password) {
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
}

export async function getMe() {
  const response = await axios.post(
    `${API_URL.baseURL}getme`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function logout() {
  const response = await axios.post(
    `${API_URL.baseURL}logout`,
    {},
    { withCredentials: true },
  );
  return response.data;
}
