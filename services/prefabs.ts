import { PrefabRequest } from "@/types/PrefabInterfaces";
import client from "@/services/client";

export async function createPrefab(prefabRequest: PrefabRequest) {
  try {
    await client.post("/prefabs", prefabRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

export async function updatePrefab(
  prefabIdentifier: string,
  prefabRequest: PrefabRequest,
) {
  try {
    await client.patch(`/prefabs/${prefabIdentifier}`, prefabRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while updating the prefab: ${errorMessage}`,
    );
  }
}

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
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while updating the prefab status: ${errorMessage}`,
    );
  }
}

export async function deletePrefab(identifier: string) {
  try {
    return await client.delete(`/prefabs/${identifier}`);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while deleting the prefab: ${errorMessage}`,
    );
  }
}

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
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while getting the prefab: ${errorMessage}`,
    );
  }
}

export async function getPrefabs() {
  try {
    return await client.get(`/prefabs`);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage || error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while getting the prefabs: ${errorMessage}`,
    );
  }
}
