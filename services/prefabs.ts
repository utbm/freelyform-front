import axios from "axios";

import { PrefabRequest } from "@/types/PrefabInterfaces";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/prefabs";

export async function createPrefab(
  token: string | null,
  prefabRequest: PrefabRequest,
) {
  if (!token) throw new Error("You should be logged in to create a prefab!");
  try {
    await axios.post(`${API_URL}`, prefabRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

export async function updatePrefab(
  identifier: string,
  prefabRequest: PrefabRequest,
) {
  try {
    return await axios.put(`${API_URL}/${identifier}`, prefabRequest);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

export async function deletePrefab(token: string | null, identifier: string) {
  if (!token) throw new Error("You should be logged in to delete a prefab!");
  try {
    return await axios.delete(`${API_URL}/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

export async function getPrefabById(
  token: string | null,
  identifier: string,
  withHiddenFields = false,
) {
  try {
    const url = `${API_URL}/${identifier}${withHiddenFields ? "?withHidden=true" : ""}`;

    // Set headers conditionally based on token presence
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      : {};

    return await axios.get(url, config);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}

export async function getPrefabs(token: string | null) {
  try {
    return await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab: ${errorMessage}`,
    );
  }
}
