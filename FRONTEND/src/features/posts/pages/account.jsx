import { useCallback, useEffect, useState } from "react";
import { Check, CheckCircle2, Clock, Send, UserCheck, Users, X, XCircle } from "lucide-react";
import NavBar from "../components/navBar";
import { useAuth } from "../../auths/hooks/useAuth";
import { getApiErrorMessage } from "../../../config/api";
import { useFeeds } from "../hooks/useFeeds";
import { getFollowRequests, updateFollowRequest } from "../services/post.api";
import "../styles/account.scss";

const Account = () => {
  const { user } = useAuth();
  const { handleGetFeeds, handleGetDiscoverUsers } = useFeeds();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFollowRequests();
      setIncoming(response.incoming || []);
      setOutgoing(response.outgoing || []);
      setFollowers(response.followers || []);
      setFollowing(response.following || []);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load follow requests."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => loadRequests());
  }, [loadRequests]);

  const refreshSocialState = async () => {
    await Promise.allSettled([
      loadRequests(),
      handleGetFeeds(),
      handleGetDiscoverUsers(),
    ]);
  };

  const handleRequestAction = async (requestId, action) => {
    setError("");
    setNotice("");
    setUpdatingId(requestId);
    try {
      const response = await updateFollowRequest(requestId, action);
      setNotice(response.message || `Request ${action === "accept" ? "accepted" : "rejected"}.`);
      await refreshSocialState();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not update follow request."));
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="account-page">
      <NavBar />
      <section className="account-shell">
        <header className="account-hero">
          <img src={user?.profileImage} alt={`${user?.username || "User"} profile`} />
          <div>
            <span>Account</span>
            <h1>@{user?.username}</h1>
            <p>{user?.bio || "Manage your private Minista network."}</p>
          </div>
        </header>

        {notice && <div className="account-alert account-alert--success"><CheckCircle2 size={18} />{notice}</div>}
        {error && <div className="account-alert"><XCircle size={18} />{error}</div>}

        <section className="request-grid">
          <RequestPanel title="Incoming requests" count={incoming.length} loading={loading} icon={<UserCheck size={18} />} tone="blue">
            {incoming.length === 0 ? (
              <EmptyState icon={<Check size={28} />} title="No pending requests" copy="New follow requests will appear here." />
            ) : (
              incoming.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <button
                    className="accept-btn"
                    disabled={updatingId === request.id}
                    onClick={() => handleRequestAction(request.id, "accept")}
                  >
                    <Check size={14} />
                    {updatingId === request.id ? "Saving" : "Accept"}
                  </button>
                  <button
                    className="reject-btn"
                    disabled={updatingId === request.id}
                    onClick={() => handleRequestAction(request.id, "reject")}
                  >
                    <X size={14} />
                    Reject
                  </button>
                </RequestRow>
              ))
            )}
          </RequestPanel>

          <RequestPanel title="Sent requests" count={outgoing.length} loading={loading} icon={<Send size={18} />} tone="yellow">
            {outgoing.length === 0 ? (
              <EmptyState icon={<Clock size={28} />} title="Nothing waiting" copy="Requests you send from the feed will show here." />
            ) : (
              outgoing.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <span className="pending-pill"><Clock size={13} />Pending</span>
                </RequestRow>
              ))
            )}
          </RequestPanel>

          <RequestPanel title="Followers" count={followers.length} loading={loading} icon={<Users size={18} />} tone="green">
            {followers.length === 0 ? (
              <EmptyState icon={<Users size={28} />} title="No followers yet" copy="Accepted requests sent to you appear here." />
            ) : (
              followers.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <span className="accepted-pill"><CheckCircle2 size={13} />Accepted</span>
                </RequestRow>
              ))
            )}
          </RequestPanel>

          <RequestPanel title="Following" count={following.length} loading={loading} icon={<UserCheck size={18} />} tone="pink">
            {following.length === 0 ? (
              <EmptyState icon={<Users size={28} />} title="Not following anyone yet" copy="People who accept your requests appear here." />
            ) : (
              following.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <span className="accepted-pill"><CheckCircle2 size={13} />Connected</span>
                </RequestRow>
              ))
            )}
          </RequestPanel>
        </section>
      </section>
    </main>
  );
};

const RequestPanel = ({ title, count, loading, children, icon, tone }) => (
  <div className="request-panel">
    <div className="request-panel__title">
      <div className="request-panel__heading">
        <span className={`panel-icon panel-icon--${tone}`}>{icon}</span>
        <h2>{title}</h2>
      </div>
      <span className="request-count">{count}</span>
    </div>
    {loading ? <p className="muted-copy">Loading...</p> : children}
  </div>
);

const RequestRow = ({ request, children }) => (
  <article className="request-row">
    <img src={request.user?.profileImage} alt={`${request.user?.username || "User"} profile`} />
    <div>
      <strong>@{request.user?.username}</strong>
      <span>{request.user?.bio || "Minista creator"}</span>
    </div>
    <div className="request-actions">{children}</div>
  </article>
);

const EmptyState = ({ icon, title, copy }) => (
  <div className="request-empty">
    <span className="empty-icon">{icon || <X size={28} />}</span>
    <h3>{title}</h3>
    <p>{copy}</p>
  </div>
);

export default Account;
