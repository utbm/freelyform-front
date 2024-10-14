"use client";

import React from "react";

import PrefabsTable from "@/components/private/lists/PrefabsTable";
import { useAuth } from "@/contexts/AuthContext";

export default function ListPrefabs() {
  return (
    <>
      <PrefabsTable />
    </>
  );
}
