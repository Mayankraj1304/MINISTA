/* eslint-disable react-refresh/only-export-components */
import { useCallback, useState, createContext } from "react";
import { createPost, getFeeds, likePost, unlikePost } from "./services/post.api";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;

  const handleGetFeeds = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFeeds();
      setFeeds(response.posts);
    } catch (error) {
      setError(getErrorMessage(error, "Could not load the feed."));
      throw error;
    } finally {
      setLoading(false);
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
      setError(getErrorMessage(error, "Could not create the post."));
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
      setError(getErrorMessage(error, "Could not update the like."));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return (
    <PostContext.Provider
      value={{
        feeds,
        loading,
        error,
        clearError,
        handleGetFeeds,
        handleCreatePost,
        handleToggleLike,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
