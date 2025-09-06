"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname?: string; // for counselors
  role: "user" | "counselor";
  access_token: string;
}

interface UserContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

// Context
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      const email = localStorage.getItem("email");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role") as "user" | "counselor";
      const firstname = localStorage.getItem("firstname") || undefined;
      const lastname = localStorage.getItem("lastname") || undefined;
      const fullname = localStorage.getItem("fullname") || undefined;
      if (token && email && role) {
        setUser({
          access_token: token,
          email,
          username: username || undefined,
          firstname,
          lastname,
          fullname,
          role,
        });
      }
    } catch {}
  }, []);

  // Save to localStorage on user change
  useEffect(() => {
    if (user) {
      localStorage.setItem("access_token", user.access_token);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      if (user.username) localStorage.setItem("username", user.username);
      if (user.firstname) localStorage.setItem("firstname", user.firstname);
      if (user.lastname) localStorage.setItem("lastname", user.lastname);
      if (user.fullname) localStorage.setItem("fullname", user.fullname);
      // Set cookie for backend
      document.cookie = `access_token_cookie=${user.access_token}; path=/; secure; samesite=strict; https://www.clivo.space`;
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      localStorage.removeItem("fullname");
      // Remove cookie
      document.cookie = "access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);