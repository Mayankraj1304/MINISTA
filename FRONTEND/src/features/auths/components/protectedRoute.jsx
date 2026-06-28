import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading, verifyUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    Promise.resolve().then(() => verifyUser());

    const sessionCheck = setInterval(() => {
      verifyUser({ showLoading: false });
    }, 5000);

    return () => clearInterval(sessionCheck);
  }, [location.pathname, verifyUser]);

  if (loading) {
    return <div className="feed-status-message">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
