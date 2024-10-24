// pages/admin/users.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import UsersTable from "@/components/private/lists/UsersTable";
import { hasRole } from "@/lib/utils";

export default function Page() {
  const router = useRouter();

  // Check if user is an admin
  useEffect(() => {
    if (!hasRole("ADMIN")) {
      router.push("/");
    }
  }, [router]);

  return <UsersTable />;
}
