// services/userService.ts
import client from "@/services/client";
import { User, UserRolesRequest } from "@/types/UserInterfaces";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export async function getUsers(): Promise<User[]> {
  try {
    const response = await client.get(API_URL);

    // Assuming response.data is an array of users
    return response.data.map((user: any) => ({
      ...user,
      roles: user.role, // Map 'role' from API to 'roles' in frontend
    }));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while getting the user list: ${errorMessage}`,
    );
  }
}

export async function updateUserRoles(userId: string, roles: UserRolesRequest) {
  try {
    await client.patch(`${API_URL}/${userId}`, roles);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while updating the user roles: ${errorMessage}`,
    );
  }
}

export async function deleteUser(userId: string) {
  try {
    await client.delete(`${API_URL}/${userId}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while deleting the user: ${errorMessage}`,
    );
  }
}
