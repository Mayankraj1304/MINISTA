/* eslint-disable react-refresh/only-export-components */
import { useCallback, useState, createContext } from "react";
import {
  createPost,
  getDiscoverUsers,
  getFeeds,
  likePost,
  requestFollow,
  unlikePost,
} from "./services/post.api";
import { getApiErrorMessage } from "../../config/api";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetFeeds = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFeeds();
      setFeeds(response.posts);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load the feed."));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetDiscoverUsers = useCallback(async () => {
    setUsersLoading(true);
    setError("");
    try {
      const response = await getDiscoverUsers();
      setDiscoverUsers(response.users);
      return response.users;
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load people to follow."));
      throw error;
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const handleCreatePost = useCallback(async (formData) => {
    setLoading(true);
    setError("");
    try {
      const response = await createPost(formData);
      if (response.post) {
        setFeeds((prevFeeds) => [response.post, ...prevFeeds]);
      }
      return response.post;
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not create the post."));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleLike = useCallback(async (postId, likedByMe) => {
    setError("");
    try {
      if (likedByMe) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      setFeeds((prevFeeds) =>
        prevFeeds.map((post) =>
          post._id === postId
            ? {
                ...post,
                likedByMe: !likedByMe,
                likesCount: Math.max(
                  (post.likesCount || 0) + (likedByMe ? -1 : 1),
                  0,
                ),
              }
            : post,
        ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not update the like."));
      throw error;
    }
  }, []);

  const handleRequestFollow = useCallback(async (username) => {
    setError("");
    try {
      await requestFollow(username);
      setDiscoverUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, followStatus: "pending" } : user,
        ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not send follow request."));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return (
    <PostContext.Provider
      value={{
        feeds,
        discoverUsers,
        loading,
        usersLoading,
        error,
        clearError,
        handleGetFeeds,
        handleGetDiscoverUsers,
        handleCreatePost,
        handleToggleLike,
        handleRequestFollow,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

