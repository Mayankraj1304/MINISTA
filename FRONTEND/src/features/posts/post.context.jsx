import { useState, createContext } from "react";
import { getFeeds } from "./services/post.api";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleGetFeeds = async () => {
    setLoading(false);
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

  return (
    <PostContext.Provider value={{ feeds, loading, handleGetFeeds }}>
      {children}
    </PostContext.Provider>
  );
};
