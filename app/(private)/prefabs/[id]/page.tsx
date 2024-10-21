"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { getAnswersByPrefabId } from "@/services/answers";
import { Answers } from "@/types/AnswerInterfaces";

export default function Page({ params }: { params: { id: string } }) {
  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await getAnswersByPrefabId(params.id);
        const fetchedAnswers = response.data as Answers;

        return fetchedAnswers;
      } catch (error) {
        toast.error("An error occurred while fetching the answers");
      }
    }
    fetchForm();
  }, [params.id]);

  return <div>{params.id}</div>;
}
