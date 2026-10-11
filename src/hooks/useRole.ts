"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/types";

export function useRole(initialRole: UserRole = "pro") {
  const [role, setRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    const saved = localStorage.getItem("fauteo_active_role") as UserRole | null;
    if (saved && (saved === "pro" || saved === "host" || saved === "admin")) {
      setRole(saved);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("fauteo_active_role", newRole);
  };

  const toggleProHost = () => {
    const nextRole: UserRole = role === "pro" ? "host" : "pro";
    switchRole(nextRole);
  };

  return {
    role,
    isPro: role === "pro",
    isHost: role === "host",
    isAdmin: role === "admin",
    switchRole,
    toggleProHost,
  };
}
