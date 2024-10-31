import axios from "axios";

import { getJwtToken } from "@/lib/utils";

const inDevEnvironment = !!process && process.env.NODE_ENV === 'development';

/**
 * This creates an Axios client instance with a base URL and default headers for content type.
 * It attaches an interceptor that adds the JWT token to the Authorization header of each request, if available.
 */
const client = axios.create({
  // base URL should be the window.location.origin if in production mode, or the API URL if in development mode it should be the .env variable
  baseURL: inDevEnvironment ? process.env.NEXT_PUBLIC_BASE_API_URL : "/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getJwtToken();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default client;
