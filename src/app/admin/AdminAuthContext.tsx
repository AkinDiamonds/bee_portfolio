// src/app/admin/AdminAuthContext.tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

interface AdminAuthCtx {
  username: string;
  password: string;
  authHeader: string; // precomputed "Basic xxx" value
}

const AdminAuthContext = createContext<AdminAuthCtx>({
  username: "",
  password: "",
  authHeader: "",
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

interface AdminAuthProviderProps {
  username: string;
  password: string;
  children: ReactNode;
}

export function AdminAuthProvider({ username, password, children }: AdminAuthProviderProps) {
  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
  return (
    <AdminAuthContext.Provider value={{ username, password, authHeader }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
