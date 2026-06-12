import { useContext } from "react";
import { PostContext } from "../post.context";

export const useFeeds = () => {
  const context = useContext(PostContext);
  return context;
  console.log(context);
};
