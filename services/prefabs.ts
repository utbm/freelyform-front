import { PrefabRequest } from "@/types/PrefabInterfaces";
import client from "@/services/client";

/**
 * This function creates a prefab by making a POST request to the API.
 * It accepts a prefab request object as a parameter.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function createPrefab(prefabRequest: PrefabRequest) {
  try {
    await client.post("/prefabs", prefabRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

/**
 * This function updates an existing prefab by making a PATCH request to the API.
 * It accepts the prefab identifier and the updated prefab request object as parameters.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function updatePrefab(
  prefabIdentifier: string,
  prefabRequest: PrefabRequest,
) {
  try {
    await client.patch(`/prefabs/${prefabIdentifier}`, prefabRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while updating the prefab: ${errorMessage}`,
    );
  }
}

/**
 * This function changes the status (active or inactive) of a prefab by making a PATCH request to the API.
 * It accepts the prefab identifier and the desired state as parameters.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function changePrefabStatus(
  prefabIdentifier: string,
  toState: boolean,
) {
  try {
    await client.patch(`/prefabs/${prefabIdentifier}/activation`, {
      active: toState,
    });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while updating the prefab status: ${errorMessage}`,
    );
  }
}

/**
 * This function deletes a prefab by making a DELETE request to the API.
 * It accepts the prefab identifier as a parameter.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function deletePrefab(identifier: string) {
  try {
    return await client.delete(`/prefabs/${identifier}`);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while deleting the prefab: ${errorMessage}`,
    );
  }
}

/**
 * This function retrieves a specific prefab by its identifier by making a GET request to the API.
 * It optionally includes hidden fields if the parameter `withHiddenFields` is set to true.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function getPrefabById(
  identifier: string,
  withHiddenFields = false,
) {
  try {
    return await client.get(`/prefabs/${identifier}`, {
      params: {
        withHidden: withHiddenFields,
      },
    });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while getting the prefab: ${errorMessage}`,
    );
  }
}

/**
 * This function retrieves all prefabs by making a GET request to the API.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function getPrefabs() {
  try {
    return await client.get(`/prefabs`);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while getting the prefabs: ${errorMessage}`,
    );
  }
}
