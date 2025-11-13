import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {}
});

const AUTH_TOKEN_KEY = "sleepwise-auth-token";
const BASE_URL = "https://sleepqualityapp-backend.onrender.com";

function decodeToken(token) {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(atob(payload));
    return { id: json?.id, email: json?.email };
  } catch (err) {
    return null;
  }
}

function normalizeUser(rawUser) {
  if (!rawUser) return null;
  const id = rawUser.id || rawUser._id || null;
  return {
    ...rawUser,
    id,
    _id: rawUser._id || id
  };
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => normalizeUser(decodeToken(localStorage.getItem(AUTH_TOKEN_KEY))));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setUser(normalizeUser(decodeToken(token)));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    }
    if (token) {
      setError(null);
    }
  }, [token]);

  const login = useCallback(async (payload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const message = await parseJsonSafely(response);
        throw new Error(message?.error || message?.message || "Unable to login");
      }
      const data = await parseJsonSafely(response);
      setToken(data?.token || "");
      const incomingUser = normalizeUser(data?.user) || normalizeUser(decodeToken(data?.token));
      setUser(incomingUser);
      navigate("/home");
    } catch (err) {
      console.error(err);
      const fallbackMessage = "The server is currently warming up. Please wait a few minutes and try again.";
      const serverMessage = err?.message;
      setError(serverMessage || fallbackMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (payload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const message = await parseJsonSafely(response);
        throw new Error(message?.error || message?.message || "Unable to signup");
      }
      const data = await parseJsonSafely(response);
      setToken(data?.token || "");
      const incomingUser = normalizeUser(data?.user) || normalizeUser(decodeToken(data?.token));
      setUser(incomingUser);
      navigate("/home");
    } catch (err) {
      console.error(err);
      const fallbackMessage = "The server is currently warming up. Please wait a few minutes and try again.";
      const serverMessage = err?.message;
      setError(serverMessage || fallbackMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    signup,
    logout,
    isLoading,
    error
  }), [token, user, login, signup, logout, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
