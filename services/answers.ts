import client from "@/services/client";
import {
  Answer,
  AnswerGeolocation,
  AnswerRequest,
} from "@/types/AnswerInterfaces";

/**
 * This function creates an answer for a given prefab by making a POST request to the API.
 * It accepts the ID of the prefab and the answer request object as parameters.
 * If there's an error, it extracts a meaningful error message if possible and throws a new error with the message.
 */
export async function createAnswer(
  prefabId: string,
  answerRequest: AnswerRequest,
) {
  try {
    await client.post(`/answers/${prefabId}`, answerRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`,
    );
  }
}

/**
 * This function fetches the answers associated with a specific prefab ID by making a GET request to the API.
 * It optionally accepts a geolocation object, which can be used to filter results based on location.
 * If there's a geolocation, it adds latitude, longitude, and distance to the query parameters.
 * If an error occurs, it extracts a meaningful error message if possible and throws a new error with the message.
 */
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

    return await client.get(`/answers/${prefabId}`, { params });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while fetching the prefab answers: ${errorMessage}`,
    );
  }
}

export async function getAnswerById(prefabId: string, answerId: string) {
  try {
    const response = await client.get(`/${prefabId}/${answerId}`);

    return response.data as Answer;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while fetching the prefab answer: ${errorMessage}`,
    );
  }
}
