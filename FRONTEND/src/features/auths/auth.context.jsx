/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useCallback, useEffect, useState, createContext } from "react";
import { login, register, getMe, logout } from "./services/auth.api";
import { getApiErrorMessage } from "../../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const verifyUser = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await getMe();
      setUser(response.user);
      setError("");
      return response.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => verifyUser());
  }, [verifyUser]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
        }

        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await login(username, password);
      setUser(response.user);
      return response.user;
    } catch (error) {
      setUser(null);
      setError(getApiErrorMessage(error, "Unable to sign in. Please try again."));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await register(username, email, password);
      setUser(response.user);
      return response.user;
    } catch (error) {
      setUser(null);
      setError(
        getApiErrorMessage(error, "Unable to create your account. Please try again."),
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
    } catch (error) {
      setError(getApiErrorMessage(error, "Logout failed. Please try again."));
      throw error;
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        verifyUser,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
