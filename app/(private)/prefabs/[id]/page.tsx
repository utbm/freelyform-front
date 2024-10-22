"use client";

import AnswersTable from "@/components/private/lists/AnswersTable";

export default function Page({ params }: { params: { id: string } }) {
  return <AnswersTable params={params} />;
}
