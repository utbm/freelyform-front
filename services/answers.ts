import { AnswerRequest } from "@/types/AnswerInterfaces";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/answers";

export async function createAnswer(
  token: string | null,
  prefabId: string,
  answerRequest: AnswerRequest
) {
  try {
    // Set headers conditionally based on token presence
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      : {};
    await axios.post(`${API_URL}/${prefabId}`, answerRequest, config);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`
    );
  }
}

export async function getAnswersByPrefabId(token: string | null, prefabId: string) {
  try {
    // Set headers conditionally based on token presence
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      : {};
    return await axios.get(`${API_URL}/${prefabId}`, config);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`
    );
  }
}
