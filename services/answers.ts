import client from "@/services/client";
import { AnswerGeolocation, AnswerRequest } from "@/types/AnswerInterfaces";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/answers";

export async function createAnswer(
  prefabId: string,
  answerRequest: AnswerRequest,
) {
  try {
    await client.post(`${API_URL}/${prefabId}`, answerRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`,
    );
  }
}

export async function getAnswersByPrefabId(
  prefabId: string,
  geolocation?: AnswerGeolocation | null,
) {
  try {
    const params: any = {};

    if (geolocation) {
      params.lat = geolocation.lat;
      params.lng = geolocation.lng;
      params.distance = geolocation.distance;
    }

    return await client.get(`${API_URL}/${prefabId}`, { params });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while fetching the prefab answers: ${errorMessage}`,
    );
  }
}
