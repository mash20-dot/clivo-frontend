"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setApiLogoutHandler } from "./api";

export interface AuthUser {
  id?: string;
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  role: "user" | "counselor";
  access_token: string;
}

interface UserContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      // Load ALL user info from localStorage, especially 'id'
      const token = localStorage.getItem("access_token");
      const email = localStorage.getItem("email");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role") as "user" | "counselor";
      const firstname = localStorage.getItem("firstname") || undefined;
      const lastname = localStorage.getItem("lastname") || undefined;
      const fullname = localStorage.getItem("fullname") || undefined;
      const id = localStorage.getItem("id") || undefined;

      // Debug: Show what id we have from localStorage
      console.log("UserContext localStorage id:", id);

      if (token && email && role) {
        setUser({
          id, // <-- Ensure 'id' is set!
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

  useEffect(() => {
    if (user) {
      if (user.id) localStorage.setItem("id", user.id); // <-- Save id!
      localStorage.setItem("access_token", user.access_token);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      if (user.username) localStorage.setItem("username", user.username);
      if (user.firstname) localStorage.setItem("firstname", user.firstname);
      if (user.lastname) localStorage.setItem("lastname", user.lastname);
      if (user.fullname) localStorage.setItem("fullname", user.fullname);
      document.cookie = `access_token_cookie=${user.access_token}; path=/; secure; samesite=strict; https://www.clivo.space`;
    } else {
      localStorage.removeItem("id");
      localStorage.removeItem("access_token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      localStorage.removeItem("fullname");
      document.cookie =
        "access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    setApiLogoutHandler(logout);
    return () => setApiLogoutHandler(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);