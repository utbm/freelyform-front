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

export async function logoutUser() {
  removeJwtToken();
}

export function isLoggedUser() {
  return !isExpiredJwtToken() && !!getJwtToken();
}

export async function getLoggedUser(): Promise<User> {
  try {
    return getJwtTokenData();
  } catch (error: any) {
    throw new Error(
      "An error occurred on the application while getting the logged user",
    );
  }
}
