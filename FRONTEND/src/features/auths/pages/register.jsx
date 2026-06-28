import React from "react";
import "../styles/forms.scss";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { loading, error, clearError, handleRegister } = useAuth();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      navigate("/");
    } catch (error) {
      console.error("Register failed:", error);
    }
  }

  return (
    <div className="auth-container">
      <main className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">
            Join us today by filling out your details
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
            <label className="auth-form__label" htmlFor="username">
              Username
            </label>
            <input
              className="auth-form__input"
              type="text"
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="email">
              Email Address
            </label>
            <input
              className="auth-form__input"
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="password">
              Password
            </label>
            <input
              className="auth-form__input"
              type="password"
              id="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-form__submit-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Get Started"}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-form__link auth-form__link--bold">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
