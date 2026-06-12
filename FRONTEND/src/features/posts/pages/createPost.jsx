import React, { useState, useRef } from "react";
import "../styles/createPost.scss";
import { useNavigate } from "react-router-dom";
import { useFeeds } from "../hooks/useFeeds";

// 1. MUST BE CAPITALIZED 'CreatePost' so React recognizes it as a component body
const CreatePost = () => {
  const [content, setContent] = useState("");
  const fileInputRef = useRef(null);
  
  // These hooks are now safe because they are inside a capitalized component function!
  const navigate = useNavigate(); 
  const { loading, handleCreatePost } = useFeeds();

  if (loading) {
    return (
      <main className="page-wrapper">
        <div style={{ color: "#262626", fontWeight: "600" }}>loading...</div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("caption", content);
    formData.append("imgUrl", file);

    try {
      await handleCreatePost(formData);
      navigate("/feeds");
    } catch (error) {
      console.error("Error creating your post: ", error);
    }
  };

  return (
    <div className="page-wrapper">
      <main className="form-container">
        <h1 className="form-title">Create Post</h1>

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="post-image" className="file-label">
              <span>📁 Choose Media</span>
              <input
                ref={fileInputRef}
                type="file"
                id="post-image"
                name="imgUrl"
                required
                className="file-input"
                accept="image/*,video/*"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="content" className="text-label">
              Caption
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              id="content"
              name="content"
              placeholder="What's on your mind?..."
              className="text-input"
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            Create Post
          </button>
        </form>
      </main>
    </div>
  );
};

// 2. Export the capitalized component name
export default CreatePost;