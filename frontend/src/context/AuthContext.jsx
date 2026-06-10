import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../api/http";

const AuthContext = createContext(null);
const storageKey = "finora_auth";

const emptyAuth = { user: null, token: null };

const readStoredAuth = () => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : emptyAuth;
  } catch {
    localStorage.removeItem(storageKey);
    return emptyAuth;
  }
};

const normalizeUser = (user) => ({
  ...user,
  id: user?.id || user?._id
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);
  const [checkingSession, setCheckingSession] = useState(() => Boolean(readStoredAuth().token));

  const persist = (payload) => {
    const normalized = { ...payload, user: normalizeUser(payload.user) };
    localStorage.setItem(storageKey, JSON.stringify(normalized));
    setAuth(normalized);
  };

  const clearSession = () => {
    localStorage.removeItem(storageKey);
    setAuth(emptyAuth);
  };

  useEffect(() => {
    let active = true;

    const validateStoredSession = async () => {
      if (!auth.token) {
        setCheckingSession(false);
        return;
      }

      try {
        const { data } = await api.get("/profile");
        if (!active) return;
        persist({ token: auth.token, user: data.user });
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setCheckingSession(false);
      }
    };

    validateStoredSession();
    return () => {
      active = false;
    };
  }, []);

  const register = async (values) => {
    try {
      const { data } = await api.post("/auth/register", values);
      persist(data);
      setCheckingSession(false);
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
      setCheckingSession(false);
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
      setCheckingSession(false);
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
    const token = auth.token;
    clearSession();
    setCheckingSession(false);
    try {
      if (token) await api.post("/auth/logout", null, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // Local logout should still complete if the server is unavailable.
    } finally {
      toast.success("Logged out");
    }
  };

  const value = useMemo(
    () => ({
      ...auth,
      checkingSession,
      isAuthenticated: Boolean(auth.token && auth.user),
      register,
      login,
      googleLogin,
      logout,
      updateUser,
      setSession
    }),
    [auth, checkingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
