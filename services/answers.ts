import axios from "axios";

import { PrefabRequest } from "@/types/PrefabInterfaces";
import { AnswerRequest } from "@/types/AnswerInterfaces";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/answers";

export async function createAnswer(
  token: string | null,
  answerRequest: AnswerRequest,
) {
  try {
    // Set headers conditionally based on token presence
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
      : {};

    return await axios.post(API_URL, answerRequest, config);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`,
    );
  }
}


export async function getAnswers(token: string | null, prefabIdentifier: string) {
  try {
    // return await axios.get(`${API_URL}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}
