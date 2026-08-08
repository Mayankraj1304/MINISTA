import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const API_URL = {
  baseURL: `${API_BASE_URL}/posts/`,
  withCredentials: true,
};

export async function getFeeds() {
  const response = await axios.get(`${API_URL.baseURL}feed`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createPost(formData) {
  const response = await axios.post(API_URL.baseURL, formData, {
    withCredentials: true,
  });
  return response.data;
}

export async function likePost(postId) {
  const response = await axios.post(
    `${API_BASE_URL}/user/likes/${postId}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function unlikePost(postId) {
  const response = await axios.delete(
    `${API_BASE_URL}/user/likes/${postId}`,
    { withCredentials: true },
  );
  return response.data;
}

export async function getDiscoverUsers() {
  const response = await axios.get(`${API_BASE_URL}/user/follows/users`, {
    withCredentials: true,
  });
  return response.data;
}

export async function requestFollow(username) {
  const response = await axios.post(
    `${API_BASE_URL}/user/follows/${username}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function getFollowRequests() {
  const response = await axios.get(`${API_BASE_URL}/user/follows/requests`, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateFollowRequest(requestId, action) {
  const response = await axios.patch(
    `${API_BASE_URL}/user/follows/requests/${requestId}/${action}`,
    {},
    { withCredentials: true },
  );
  return response.data;
}
