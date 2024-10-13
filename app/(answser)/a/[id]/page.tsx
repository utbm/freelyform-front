"use client";

import Questionnaire from "@/components/public/questionnaire/questionnaire";

export default function Page({ params }: { params: { id: string } }) {
  return <Questionnaire params={params} />;
}
