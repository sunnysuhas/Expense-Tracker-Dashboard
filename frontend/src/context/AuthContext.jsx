import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../api/http";

const AuthContext = createContext(null);
const storageKey = "finora_auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  const persist = (payload) => {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setAuth(payload);
  };

  const register = async (values) => {
    try {
      const { data } = await api.post("/auth/register", values);
      persist(data);
      toast.success("Registration successful");
      return data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const login = async (values) => {
    try {
      const { data } = await api.post("/auth/login", values);
      persist(data);
      toast.success("Login successful");
      return data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await api.post("/auth/google", { credential });
      persist(data);
      toast.success("Google login successful");
      return data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const updateUser = (user) => persist({ ...auth, user });
  const setSession = (payload) => persist(payload);

  const logout = async () => {
    try {
      if (auth.token) await api.post("/auth/logout");
    } catch {
      // Local logout should still complete if the server is unavailable.
    } finally {
      localStorage.removeItem(storageKey);
      setAuth({ user: null, token: null });
      toast.success("Logged out");
    }
  };

  const value = useMemo(
    () => ({ ...auth, isAuthenticated: Boolean(auth.token), register, login, googleLogin, logout, updateUser, setSession }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
