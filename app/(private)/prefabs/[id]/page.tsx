"use client";

import { getAnswersByPrefabId } from "@/services/answers";
import { useEffect } from "react";
import { getPrefabById } from "@/services/prefabs";
import { Form, FormGroup } from "@/types/FormTypes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Page({ params }: { params: { id: string } }) {
  const { token } = useAuth();


  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await getAnswersByPrefabId(token, params.id);
        console.log(response.data);
      } catch (error) {
        toast.error("An error occurred while fetching the answers");
      }
    }
    fetchForm();
  }, [params.id]);

  return (<div>
    { params.id }
  </div>)
}
