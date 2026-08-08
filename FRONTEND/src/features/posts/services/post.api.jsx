import axios from "axios";
import { API_BASE_URL, assertApiConfigured } from "../../../config/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/posts/`,
  withCredentials: true,
};

export async function getFeeds() {
  assertApiConfigured();
  const response = await axios.get(`${API_URL.baseURL}feed`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createPost(formData) {
  assertApiConfigured();
  const response = await axios.post(API_URL.baseURL, formData, {
    withCredentials: true,
  });
  return response.data;
}

export async function likePost(postId) {
  assertApiConfigured();
  const response = await axios.post(
    `${API_BASE_URL}/user/likes/${postId}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function unlikePost(postId) {
  assertApiConfigured();
  const response = await axios.delete(
    `${API_BASE_URL}/user/likes/${postId}`,
    { withCredentials: true },
  );
  return response.data;
}

export async function getDiscoverUsers() {
  assertApiConfigured();
  const response = await axios.get(`${API_BASE_URL}/user/follows/users`, {
    withCredentials: true,
  });
  return response.data;
}

export async function requestFollow(username) {
  assertApiConfigured();
  const response = await axios.post(
    `${API_BASE_URL}/user/follows/${username}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function getFollowRequests() {
  assertApiConfigured();
  const response = await axios.get(`${API_BASE_URL}/user/follows/requests`, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateFollowRequest(requestId, action) {
  assertApiConfigured();
  const response = await axios.patch(
    `${API_BASE_URL}/user/follows/requests/${requestId}/${action}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}
