// pages/[id]/[answerId]/page.tsx

"use client";

import React from "react";

import AnswerViewer from "@/components/private/answers/AnswerViewer";

interface PageProps {
  params: {
    id: string;
    answerId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id: prefabId, answerId } = params;

  return <AnswerViewer answerId={answerId} prefabId={prefabId} />;
}
