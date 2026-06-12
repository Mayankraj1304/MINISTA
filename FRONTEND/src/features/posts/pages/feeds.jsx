import React, { useEffect } from "react";
import { useFeeds } from "../hooks/useFeeds";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, RotateCw } from "lucide-react";
import "../styles/feeds.scss";
import NavBar from "../components/navBar";

const Feeds = () => {
  const { feeds, loading, handleGetFeeds } = useFeeds();

  useEffect(() => {
    handleGetFeeds();
  }, []);

  return (
    <main className="feeds-page-container">
      <NavBar />
      {/* Main Content Area */}
      <div className="feeds-content">
        {loading ? (
          <div className="feed-status-message">
            <div className="spinner"></div>
            <p>Loading your feed...</p>
          </div>
        ) : feeds.length === 0 ? (
          <div className="feed-status-message">
            <p>No posts found.</p>
            <button className="retry-btn" onClick={handleGetFeeds}>Check Again</button>
          </div>
        ) : (
          <div className="posts-stack">
            {feeds.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

/* ==========================================
   Sub-Component: Single Feed Post Wrapper
   ========================================== */
const FeedPost = ({ post }) => {
  // Safe fallbacks to keep UI stable even with partial backend data
  const username = post.user?.username || "anonymous";
  const profilePic = post.user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const location = post.location || "Global";
  const likesCount = post.likes?.length || 0;
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
    : "RECENT";

  return (
    <article className="instagram-post">
      {/* Post Header */}
      <header className="post-header">
        <div className="user-info">
          <img 
            src={profilePic} 
            alt={`${username} profile`} 
            className="profile-pic" 
          />
          <div className="text-details">
            <span className="username">@{username}</span>
            <span className="location">{location}</span>
          </div>
        </div>
        <button className="action-btn more-btn" aria-label="More options">
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Post Image Container */}
      <div className="post-image-container">
        <img 
          src={post.imgUrl} 
          alt={post.caption || "Post asset"} 
          className="post-image" 
          loading="lazy"
        />
      </div>

      {/* Post Interactive Actions Footer */}
      <div className="post-actions-container">
        <div className="interaction-buttons">
          <div className="left-actions">
            <button className="action-btn like-btn" aria-label="Like post">
              <Heart size={24} />
            </button>
            <button className="action-btn" aria-label="Comment">
              <MessageCircle size={24} />
            </button>
            <button className="action-btn" aria-label="Share post">
              <Send size={24} />
            </button>
          </div>
          <button className="action-btn save-btn" aria-label="Save post">
            <Bookmark size={24} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="likes-section">
          <span>{likesCount.toLocaleString()} likes</span>
        </div>

        {/* Caption Layout */}
        <div className="caption-section">
          <span className="caption-username">@{username}</span>
          <span className="caption-text">{post.caption}</span>
        </div>

        {/* Dynamic Creation Time Stamp */}
        <div className="time-posted">
          {formattedDate.toUpperCase()}
        </div>
      </div>
    </article>
  );
};

export default Feeds;