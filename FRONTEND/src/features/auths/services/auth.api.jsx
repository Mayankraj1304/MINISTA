import axios from "axios";
import { API_BASE_URL, assertApiConfigured } from "../../../config/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/auth/`,
  withCredentials: true,
};

export async function login(username, password) {
  assertApiConfigured();
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
  assertApiConfigured();
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
  assertApiConfigured();
  const response = await axios.post(
    `${API_URL.baseURL}getme`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function logout() {
  assertApiConfigured();
  const response = await axios.post(
    `${API_URL.baseURL}logout`,
    {},
    { withCredentials: true },
  );
  return response.data;
}
