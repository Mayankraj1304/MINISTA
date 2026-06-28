import { useNavigate } from "react-router-dom";
import { useFeeds } from "../hooks/useFeeds";
import { useAuth } from "../../auths/hooks/useAuth";
import { LogOut, Plus, RotateCw } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const { handleGetFeeds, loading } = useFeeds();
  const { user, handleLogout } = useAuth();

  const logout = async () => {
    await handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="feeds-top-bar">
      <button className="brand-logo" type="button" onClick={() => navigate("/")}>
        MINISTA
      </button>
      <div className="nav-actions">
        <span className="nav-user">@{user?.username}</span>
        <button
          className="refresh-btn"
          onClick={() => handleGetFeeds().catch(() => {})}
          disabled={loading}
          aria-label="Refresh feed"
          title="Refresh feed"
        >
          <RotateCw size={16} className={loading ? "spinning" : ""} />
        </button>
        <button className="refresh-btn" onClick={() => navigate("/createPost")} aria-label="Create post" title="Create post">
          <Plus size={16} />
        </button>
        <button className="refresh-btn" onClick={logout} aria-label="Logout" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default NavBar;
