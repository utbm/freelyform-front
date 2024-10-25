import {
  getJwtToken,
  getJwtTokenData,
  isExpiredJwtToken,
  removeJwtToken,
  storeJwtToken,
} from "@/lib/utils";
import {
  LoginUserRequest,
  RegisterUserRequest,
  User,
} from "@/types/AuthenticationInterfaces";
import client from "@/services/client";

/**
 * This function registers a new user by making a POST request to the API.
 * It accepts the user registration details as a parameter.
 * If an error occurs, it extracts a meaningful error message if possible and throws a new error with the message.
 */
export async function registerUser(registerUser: RegisterUserRequest) {
  try {
    return client.post("/auth/register", registerUser);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while registering the user: ${errorMessage}`,
    );
  }
}

/**
 * This function logs in a user by making a POST request to the API.
 * It accepts the user login details as a parameter.
 * Upon successful login, it stores the JWT token.
 * If an error occurs, it extracts a meaningful error message if possible and throws a new error with the message.
 */
export async function loginUser(loginUser: LoginUserRequest) {
  try {
    const response = await client.post(`/auth/login`, loginUser);
    const jwtToken = response.data.token;

    if (!jwtToken) throw new Error("Invalid token received from the server");
    storeJwtToken(jwtToken);
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.technicalMessage ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error";

    throw new Error(
      `An error occurred while logging in the user: ${errorMessage}`,
    );
  }
}

/**
 * This function logs out the current user by removing the JWT token from storage.
 */
export async function logoutUser() {
  removeJwtToken();
}

/**
 * This function checks if the current user is logged in by validating the stored JWT token.
 * It returns `true` if the token is valid and not expired, otherwise `false`.
 */
export function isLoggedUser() {
  return !isExpiredJwtToken() && !!getJwtToken();
}

/**
 * This function retrieves the logged-in user’s data by decoding the stored JWT token.
 * If there's an error, it throws a new error with a generic message.
 */
export async function getLoggedUser(): Promise<User> {
  try {
    return getJwtTokenData();
  } catch (error: any) {
    throw new Error(
      "An error occurred on the application while getting the logged user",
    );
  }
}
