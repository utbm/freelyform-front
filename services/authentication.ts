import axios from "axios";

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

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";

export async function registerUser(registerUser: RegisterUserRequest) {
  try {
    return await axios.post(`${API_URL}/register`, registerUser);
  } catch (error) {
    throw new Error(
      "An error occurred on the application while registering the user",
    );
  }
}

export async function loginUser(loginUser: LoginUserRequest) {
  try {
    const response = await axios.post(`${API_URL}/login`, loginUser);
    const jwtToken = response.data.token;

    if (!jwtToken) throw new Error("Invalid token received from the server");
    storeJwtToken(jwtToken);
  } catch (error) {
    throw new Error(
      "An error occurred on the application while logging in the user (" +
        error +
        ")",
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
  } catch (error) {
    throw new Error(
      "An error occurred on the application while getting the logged user",
    );
  }
}
