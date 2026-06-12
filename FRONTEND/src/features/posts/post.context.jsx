import { useState, createContext, useEffect } from "react";
import { getFeeds } from "./services/post.api";
import { createPost } from "./services/post.api";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetFeeds = async () => {
    setLoading(true);
    try {
      const response = await getFeeds();
      console.log(response);
      setFeeds(response.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  const handleCreatePost = async (formData) => {
    setLoading(true);
    try {
      const response = await createPost(formData);
      if (response.post) {
        setFeeds((prevFeeds) => [response.post, ...prevFeeds]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostContext.Provider
      value={{ feeds, loading, handleGetFeeds, handleCreatePost }}
    >
      {children}
    </PostContext.Provider>
  );
};
