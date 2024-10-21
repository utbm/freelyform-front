import axios from "axios";

import { AnswerRequest } from "@/types/AnswerInterfaces";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/answers";

export async function createAnswer(
  prefabId: string,
  answerRequest: AnswerRequest,
) {
  try {
    await axios.post(`${API_URL}/${prefabId}`, answerRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`,
    );
  }
}

export async function getAnswersByPrefabId(prefabId: string) {
  try {
    return await axios.get(`${API_URL}/${prefabId}`);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`,
    );
  }
}
