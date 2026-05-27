import { getPreferences } from "@/state/persisted/preferences-store";
import type { FetchResponse } from "expo/build/winter/fetch/FetchResponse";
import type { FetchRequestInit } from "expo/fetch";
import { fetch as expoFetch } from "expo/fetch";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

/**
 * Fetch function with device ID header, and base URL
 * @param {string} endpoint - The endpoint to fetch from
 * @param {FetchRequestInit} [init] - The request options
 * @returns {Promise<FetchResponse>} - The fetch response
 */
export const customFetch = (endpoint: string, { headers, ...init }: FetchRequestInit = {}): Promise<FetchResponse> => {
  const deviceId = getPreferences()?.deviceId;

  if (!deviceId) {
    throw new Error("Device ID is not set, please check your device ID");
  }

  const isFullUrl = endpoint.startsWith("http") || endpoint.startsWith("https");

  const fullUrl = isFullUrl ? endpoint : `${BASE_URL}${endpoint}`;

  return expoFetch(fullUrl, {
    ...init,
    headers: {
      "x-device-id": deviceId,
      ...headers,
    },
  });
};

export interface DataResponse<T> {
  data: T | null;
  error?: string;
  code?: number;
  message?: string;
}
