// services/userService.ts
import client from "@/services/client";
import { User, UserRolesRequest } from "@/types/UserInterfaces";

/**
 * This function retrieves the list of users by making a GET request to the API.
 * It maps the 'role' field from the API response to 'roles' in the frontend.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await client.get("/users");

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

/**
 * This function updates the roles of a specific user by making a PATCH request to the API.
 * It accepts the user ID and the new roles as parameters.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function updateUserRoles(userId: string, roles: UserRolesRequest) {
  try {
    await client.patch(`/users/${userId}`, roles);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while updating the user roles: ${errorMessage}`,
    );
  }
}

/**
 * This function deletes a specific user by making a DELETE request to the API.
 * It accepts the user ID as a parameter.
 * If there's an error, it extracts a meaningful error message and throws a new error with the message.
 */
export async function deleteUser(userId: string) {
  try {
    await client.delete(`/users/${userId}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while deleting the user: ${errorMessage}`,
    );
  }
}
