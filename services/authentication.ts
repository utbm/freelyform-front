import axios from "axios";

import { removeJwtToken, storeJwtToken } from "@/lib/utils";
import { RegisterUserRequest } from "@/types/AuthenticationInterfaces";

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

export async function loginUser() {
  // send the request to the server and handle the response
  // TODO: implement this function
  const jwtToken = "jwtToken";

  // store the jwt token in the local storage using the utility function
  storeJwtToken(jwtToken);
}

export async function logoutUser() {
  removeJwtToken();
}
