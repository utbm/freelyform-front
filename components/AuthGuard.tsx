// components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { isLoggedUser } from "@/services/authentication";
import { getJwtToken } from "@/lib/utils";
import AuthContext from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const logged = isLoggedUser();
      const retrievedToken = getJwtToken();

      if (!logged || !retrievedToken) {
        router.replace("/login");
      } else {
        setAuthorized(true);
        setToken(retrievedToken);
      }
    };

    checkAuth();
  }, [router]);

  if (!authorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthGuard;
