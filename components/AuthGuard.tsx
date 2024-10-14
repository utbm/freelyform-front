// components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { isLoggedUser } from "@/services/authentication";
import { getJwtToken } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  shouldRedirect?: boolean; // Optional prop with default value
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  shouldRedirect = true,
}) => {
  const router = useRouter();
  // @ts-ignore
  const { setToken } = useAuth();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const logged = isLoggedUser();
      const retrievedToken = getJwtToken();

      if (!logged || !retrievedToken) {
        setToken(null); // Clear token if not authenticated
        if (shouldRedirect) {
          router.replace("/login");
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(true);
        setToken(retrievedToken);
      }
    };

    checkAuth();
  }, [router, setToken, shouldRedirect]);

  if (!authorized) {
    if (shouldRedirect) {
      // Optionally, render a loading state while redirecting
      return (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      );
    } else {
      // If not redirecting, render children regardless of authorization
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
