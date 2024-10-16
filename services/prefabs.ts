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
  token: string | null,
  prefabIdentifier: string,
  prefabRequest: PrefabRequest,
) {
  if (!token) throw new Error("You should be logged in to update a prefab!");
  try {
    await axios.patch(`${API_URL}/${prefabIdentifier}`, prefabRequest, {
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

export async function changePrefabStatus(
  token: string | null,
  prefabIdentifier: string,
  toState: boolean,
) {
  if (!token)
    throw new Error(
      "You should be logged in to change the status of a prefab!",
    );
  try {
    await axios.patch(
      `${API_URL}/${prefabIdentifier}/activation`,
      {
        active: toState,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while updating the prefab : ${errorMessage}`,
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
