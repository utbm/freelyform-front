import axios from "axios";

import { PrefabRequest } from "@/types/PrefabInterfaces";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/prefabs";

export async function createPrefab(prefabRequest: PrefabRequest) {
  try {
    await axios.post(`${API_URL}`, prefabRequest);
  } catch (error) {
    throw new Error(
      "An error occurred while creating the prefab (" + error + ")",
    );
  }
}

export async function updatePrefab(
  identifier: string,
  prefabRequest: PrefabRequest,
) {
  try {
    return await axios.put(`${API_URL}/${identifier}`, prefabRequest);
  } catch (error) {
    throw new Error(
      "An error occurred while updating the prefab (" + error + ")",
    );
  }
}

export async function deletePrefab(identifier: string) {
  try {
    return await axios.delete(`${API_URL}/${identifier}`);
  } catch (error) {
    throw new Error(
      "An error occurred while deleting the prefab (" + error + ")",
    );
  }
}

export async function getPrefabById(
  identifier: string,
  withHiddenFields = false,
) {
  try {
    return await axios.get(
      `${API_URL}/${identifier}${withHiddenFields ? "?withHidden=true" : ""}`,
    );
  } catch (error) {
    throw new Error(
      "An error occurred while getting the prefab by id (" + error + ")",
    );
  }
}

export async function getPrefabs() {
  try {
    return await axios.get(`${API_URL}`);
  } catch (error) {
    throw new Error(
      "An error occurred while getting the prefabs (" + error + ")",
    );
  }
}
