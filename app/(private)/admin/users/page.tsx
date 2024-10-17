"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { hasRole } from "@/lib/utils";

export default function Page() {
  const router = useRouter();

  if (!hasRole("ADMIN")) {
    router.push("/");

    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  } else {
    return <div>Admin page</div>;
  }
}
