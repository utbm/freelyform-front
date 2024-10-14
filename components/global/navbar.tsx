// components/GlobalNavbar.tsx
"use client";

import React from "react";

import { useAuth } from "@/contexts/AuthContext";
import { PrivateNavbar } from "@/components/private/nav/navbar";
import { PublicNavbar } from "@/components/public/nav/navbar";

const GlobalNavbar: React.FC = () => {
  const { token } = useAuth();

  return token ? <PrivateNavbar /> : <PublicNavbar />;
};

export default GlobalNavbar;
