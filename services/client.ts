import axios from "axios";

import { getJwtToken } from "@/lib/utils";

/**
 * This creates an Axios client instance with a base URL and default headers for content type.
 * It attaches an interceptor that adds the JWT token to the Authorization header of each request, if available.
 */
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
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
