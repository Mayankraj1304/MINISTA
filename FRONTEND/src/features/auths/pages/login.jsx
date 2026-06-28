import React from "react";
import "../styles/forms.scss";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { loading, error, clearError, handleLogin } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="auth-container">
      <main className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">
            Please enter your details to sign in
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="app-alert app-alert--error">
              <span>{error}</span>
              <button type="button" onClick={clearError}>Dismiss</button>
            </div>
          )}

          <div className="auth-form__group">
            <label className="auth-form__label">Username</label>
            <input
              className="auth-form__input"
              type="text"
              placeholder="Enter your username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <div className="auth-form__label-row">
              <label className="auth-form__label" htmlFor="password">
                Password
              </label>
              <a href="#forgot" className="auth-form__link">
                Forgot?
              </a>
            </div>
            <input
              className="auth-form__input"
              type="password"
              placeholder="Enter your password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-form__submit-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-form__link auth-form__link--bold">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
