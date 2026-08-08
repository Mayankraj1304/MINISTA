import { useCallback, useEffect, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import NavBar from "../components/navBar";
import { useAuth } from "../../auths/hooks/useAuth";
import { getApiErrorMessage } from "../../../config/api";
import { getFollowRequests, updateFollowRequest } from "../services/post.api";
import "../styles/account.scss";

const Account = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFollowRequests();
      setIncoming(response.incoming);
      setOutgoing(response.outgoing);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load follow requests."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => loadRequests());
  }, [loadRequests]);

  const handleRequestAction = async (requestId, action) => {
    setError("");
    try {
      await updateFollowRequest(requestId, action);
      setIncoming((requests) => requests.filter((request) => request.id !== requestId));
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not update follow request."));
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

        {error && <div className="account-alert">{error}</div>}

        <section className="request-grid">
          <div className="request-panel">
            <div className="request-panel__title">
              <h2>Incoming requests</h2>
              <span>{incoming.length}</span>
            </div>
            {loading ? (
              <p className="muted-copy">Loading requests...</p>
            ) : incoming.length === 0 ? (
              <EmptyState icon={<Check size={28} />} title="No pending requests" copy="New follow requests will appear here." />
            ) : (
              incoming.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <button className="accept-btn" onClick={() => handleRequestAction(request.id, "accept")}>
                    Accept
                  </button>
                  <button className="reject-btn" onClick={() => handleRequestAction(request.id, "reject")}>
                    Reject
                  </button>
                </RequestRow>
              ))
            )}
          </div>

          <div className="request-panel">
            <div className="request-panel__title">
              <h2>Sent requests</h2>
              <span>{outgoing.length}</span>
            </div>
            {loading ? (
              <p className="muted-copy">Loading sent requests...</p>
            ) : outgoing.length === 0 ? (
              <EmptyState icon={<Clock size={28} />} title="Nothing waiting" copy="Requests you send from the feed will show here." />
            ) : (
              outgoing.map((request) => (
                <RequestRow key={request.id} request={request}>
                  <span className="pending-pill">Pending</span>
                </RequestRow>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

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
    {icon || <X size={28} />}
    <h3>{title}</h3>
    <p>{copy}</p>
  </div>
);

export default Account;
