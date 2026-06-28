import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeeds } from "../hooks/useFeeds";
import "../styles/createPost.scss";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { loading, error, clearError, handleCreatePost } = useFeeds();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      setLocalError("Please select an image or video before publishing.");
      return;
    }

    if (!content.trim()) {
      setLocalError("Please add a caption before publishing.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("caption", content.trim());
    formData.append("imgUrl", file);

    try {
      await handleCreatePost(formData);
      navigate("/");
    } catch (error) {
      console.error("Error creating your post: ", error);
    }
  };

  return (
    <div className="page-wrapper">
      <main className="form-container">
        <h1 className="form-title">Create Post</h1>

        {(localError || error) && (
          <div className="app-alert app-alert--error">
            <span>{localError || error}</span>
            <button
              type="button"
              onClick={() => {
                setLocalError("");
                clearError();
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="post-image" className="file-label">
              <span>Choose Media</span>
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
              placeholder="What's on your mind?"
              className="text-input"
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
