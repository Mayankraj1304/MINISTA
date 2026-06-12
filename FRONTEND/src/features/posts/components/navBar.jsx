import React from "react";
import { useNavigate } from "react-router-dom";
import { useFeeds } from "../hooks/useFeeds";

const NavBar = () => {
  const navigate = useNavigate();
  const { handleGetFeeds, loading } = useFeeds();
  return (
    <header className="feeds-top-bar">
      <h1 className="brand-logo">MINISTA</h1>
      <button
        className="refresh-btn"
        onClick={handleGetFeeds}
        disabled={loading}
        aria-label="Refresh feed"
      >
        <span>Refresh</span>
      </button>
      <button className="refresh-btn" onClick={() => navigate("/createPost")}>
        <span>Create Post</span>
      </button>
    </header>
  );
};

export default NavBar;
