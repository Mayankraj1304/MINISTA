import React from "react";
import "../styles/forms.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate("/feeds");
  }
  
  if (!loading) {
    return (
      <main>
        <h1>LOADING...</h1>
      </main>
    );
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

          <button className="auth-form__submit-btn" type="submit">
            Get Started
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            Already have an account?{" "}
            <a href="#login" className="auth-form__link auth-form__link--bold">
              Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
