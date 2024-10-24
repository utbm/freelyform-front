"use client";

import Questionnaire from "@/components/public/questionnaire/questionnaire";

/**
 * Answer Page
 * This page displays the questionnaire to answer to a prefab
 *
 * @param {params} : { params: { id: string } This contains the id of the prefab to answer to
 */
export default function Page({ params }: { params: { id: string } }) {
  return <Questionnaire params={params} />;
}
