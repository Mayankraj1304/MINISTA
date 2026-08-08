import { useEffect, useMemo, useState } from "react";
import { useFeeds } from "../hooks/useFeeds";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../auths/hooks/useAuth";
import "../styles/feeds.scss";
import NavBar from "../components/navBar";

const Feeds = () => {
  const {
    feeds,
    discoverUsers,
    loading,
    usersLoading,
    error,
    clearError,
    handleGetFeeds,
    handleGetDiscoverUsers,
    handleToggleLike,
    handleRequestFollow,
  } = useFeeds();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  useEffect(() => {
    handleGetFeeds().catch(() => {});
    handleGetDiscoverUsers().catch(() => {});
  }, [handleGetFeeds, handleGetDiscoverUsers]);

  const filteredFeeds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return feeds;
    }

    return feeds.filter((post) => {
      const username = post.user?.username || "";
      const caption = post.caption || "";
      return `${username} ${caption}`.toLowerCase().includes(normalizedQuery);
    });
  }, [feeds, query]);

  const topCreators = useMemo(() => {
    const creatorMap = feeds.reduce((acc, post) => {
      const username = post.user?.username || "anonymous";
      const profileImage = post.user?.profileImage;
      const existing = acc.get(username) || {
        username,
        profileImage,
        posts: 0,
        likes: 0,
      };

      acc.set(username, {
        ...existing,
        posts: existing.posts + 1,
        likes: existing.likes + (post.likesCount || 0),
      });

      return acc;
    }, new Map());

    return Array.from(creatorMap.values())
      .sort((a, b) => b.likes - a.likes || b.posts - a.posts)
      .slice(0, 4);
  }, [feeds]);

  const totalLikes = feeds.reduce((sum, post) => sum + (post.likesCount || 0), 0);

  return (
    <main className="feeds-page-container">
      <NavBar />
      <section className="feed-shell">
        <aside className="feed-sidebar feed-sidebar--left">
          <div className="profile-panel">
            <img
              src={user?.profileImage}
              alt={`${user?.username || "User"} profile`}
              className="profile-panel__avatar"
            />
            <div>
              <span className="profile-panel__eyebrow">Signed in as</span>
              <h2>@{user?.username}</h2>
              <p>{user?.bio || "Sharing moments with the Minista circle."}</p>
            </div>
          </div>

          <div className="quick-stats">
            <div>
              <strong>{feeds.length}</strong>
              <span>Visible posts</span>
            </div>
            <div>
              <strong>{totalLikes}</strong>
              <span>Likes</span>
            </div>
          </div>
        </aside>

        <div className="feeds-content">
          <section className="feed-hero">
            <div>
              <span className="feed-hero__eyebrow">
                <ShieldCheck size={15} />
                Private follower feed
              </span>
              <h1>Only posts from people you follow appear here.</h1>
            </div>
            <label className="feed-search">
              <Search size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search visible creators or captions"
              />
            </label>
          </section>

          {topCreators.length > 0 && (
            <section className="stories-strip" aria-label="Top creators">
              {topCreators.map((creator) => (
                <button className="story-chip" key={creator.username} type="button">
                  <img src={creator.profileImage} alt={`${creator.username} profile`} />
                  <span>@{creator.username}</span>
                </button>
              ))}
            </section>
          )}

          {error && (
            <div className="app-alert app-alert--error">
              <span>{error}</span>
              <button type="button" onClick={clearError}>Dismiss</button>
            </div>
          )}

          {loading ? (
            <div className="posts-stack">
              {[1, 2, 3].map((item) => (
                <div className="post-skeleton" key={item}>
                  <div className="post-skeleton__header" />
                  <div className="post-skeleton__media" />
                  <div className="post-skeleton__line" />
                </div>
              ))}
            </div>
          ) : feeds.length === 0 ? (
            <div className="feed-status-message">
              <TrendingUp size={36} />
              <h2>No private feed posts yet</h2>
              <p>Follow people to unlock their posts, or create your first post.</p>
              <button className="retry-btn" onClick={handleGetFeeds}>Check Again</button>
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="feed-status-message">
              <Search size={36} />
              <h2>No matches</h2>
              <p>Try another creator name or caption keyword.</p>
            </div>
          ) : (
            <div className="posts-stack">
              {filteredFeeds.map((post) => (
                <FeedPost key={post._id} post={post} onToggleLike={handleToggleLike} />
              ))}
            </div>
          )}
        </div>

        <aside className="feed-sidebar feed-sidebar--right">
          <div className="trend-panel">
            <span className="trend-panel__label">Privacy MVP</span>
            <h2>Follower approval</h2>
            <p>Send a request, wait for email approval, then their posts appear in your feed.</p>
          </div>

          <DiscoverPeople
            users={discoverUsers}
            loading={usersLoading}
            onRequestFollow={handleRequestFollow}
          />

          <div className="creator-list">
            <h3>Top visible creators</h3>
            {topCreators.length === 0 ? (
              <p className="muted-copy">No visible creator activity yet.</p>
            ) : (
              topCreators.map((creator) => (
                <div className="creator-row" key={creator.username}>
                  <img src={creator.profileImage} alt={`${creator.username} profile`} />
                  <div>
                    <strong>@{creator.username}</strong>
                    <span>{creator.posts} posts · {creator.likes} likes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

const DiscoverPeople = ({ users, loading, onRequestFollow }) => {
  const [peopleQuery, setPeopleQuery] = useState("");
  const filteredUsers = users.filter((person) =>
    person.username.toLowerCase().includes(peopleQuery.trim().toLowerCase()),
  );

  return (
    <div className="discover-panel">
      <div className="discover-panel__header">
        <div>
          <span>Follow requests</span>
          <h3>Find people</h3>
        </div>
        <UserPlus size={18} />
      </div>
      <label className="mini-search">
        <Search size={15} />
        <input
          value={peopleQuery}
          onChange={(event) => setPeopleQuery(event.target.value)}
          placeholder="Search username"
        />
      </label>
      {loading ? (
        <p className="muted-copy">Loading people...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="muted-copy">No people found.</p>
      ) : (
        filteredUsers.slice(0, 6).map((person) => (
          <div className="discover-row" key={person._id}>
            <img src={person.profileImage} alt={`${person.username} profile`} />
            <div>
              <strong>@{person.username}</strong>
              <span>{person.bio || "Minista creator"}</span>
            </div>
            <button
              type="button"
              disabled={person.followStatus !== "none"}
              onClick={() => onRequestFollow(person.username).catch(() => {})}
            >
              {person.followStatus === "none" ? "Request" : person.followStatus}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const FeedPost = ({ post, onToggleLike }) => {
  const [saved, setSaved] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [shared, setShared] = useState(false);
  const username = post.user?.username || "anonymous";
  const profilePic = post.user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const location = post.location || "Global";
  const likesCount = post.likesCount || 0;
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "RECENT";

  const handleShare = async () => {
    const shareText = `${username}: ${post.caption || "New Minista post"}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Minista post", text: shareText });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }

      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  };

  const submitComment = (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setComments((prevComments) => [...prevComments, comment.trim()]);
    setComment("");
  };

  return (
    <article className="instagram-post">
      <header className="post-header">
        <div className="user-info">
          <img src={profilePic} alt={`${username} profile`} className="profile-pic" />
          <div className="text-details">
            <span className="username">@{username}</span>
            <span className="location">{location}</span>
          </div>
        </div>
        <button className="action-btn more-btn" aria-label="More options">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="post-image-container">
        <img src={post.imgUrl} alt={post.caption || "Post asset"} className="post-image" loading="lazy" />
      </div>

      <div className="post-actions-container">
        <div className="interaction-buttons">
          <div className="left-actions">
            <button
              className={`action-btn like-btn ${post.likedByMe ? "like-btn--active" : ""}`}
              aria-label={post.likedByMe ? "Unlike post" : "Like post"}
              onClick={() => onToggleLike(post._id, post.likedByMe).catch(() => {})}
            >
              <Heart size={24} fill={post.likedByMe ? "currentColor" : "none"} />
            </button>
            <button className="action-btn" aria-label="Comment" onClick={() => setCommentOpen((open) => !open)}>
              <MessageCircle size={24} />
            </button>
            <button className="action-btn" aria-label="Share post" onClick={handleShare}>
              <Send size={24} />
            </button>
          </div>
          <button
            className={`action-btn save-btn ${saved ? "save-btn--active" : ""}`}
            aria-label={saved ? "Unsave post" : "Save post"}
            onClick={() => setSaved((current) => !current)}
          >
            <Bookmark size={24} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="likes-section">
          <span>{likesCount.toLocaleString()} likes</span>
        </div>

        <div className="caption-section">
          <span className="caption-username">@{username}</span>
          <span className="caption-text">{post.caption}</span>
        </div>

        <div className="time-posted">
          <span>{formattedDate.toUpperCase()}</span>
          {shared && <span className="share-feedback">Copied to share</span>}
        </div>

        {(commentOpen || comments.length > 0) && (
          <div className="comments-panel">
            {comments.map((item, index) => (
              <p key={`${post._id}-comment-${index}`}>
                <strong>You</strong> {item}
              </p>
            ))}
            <form onSubmit={submitComment}>
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit">Post</button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};

export default Feeds;

