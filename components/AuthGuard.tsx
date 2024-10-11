"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { isLoggedUser } from "@/services/authentication";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const logged = isLoggedUser();

    if (!logged) router.replace("/login");
    else setAuthorized(true);
  }, [router]);

  if (!authorized) {
    // Optionally, render a loading state or nothing
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
