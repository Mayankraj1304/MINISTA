import { useState, createContext } from "react";
import { login, register, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = async (username, password) => {
    setLoading(false);
    try {
      const response = await login(username, password);
      setUser(response.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(false);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
};
