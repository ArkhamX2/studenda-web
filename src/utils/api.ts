import { Entity } from "../types/common";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5255";

const prepareHeaders = (headers: Record<string, string> = {}, token: string | null = null): Record<string, string> => {
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const sendRequest = async <T extends Entity>(url: string, options: RequestInit, headers: Record<string, string>): Promise<ApiResult<T>> => {
  const result: ApiResult<T> = { success: false, data: null };

  try {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      headers,
    });

    result.success = response.ok;
    if (result.success) {
      result.data = await response.json();
    }
  } catch (error) {
    console.error("Error during request:", error);
  }

  return result;
};

export interface ApiResult<T extends Entity> {
    success: boolean;
    data: T | null;
}

export const prepareBody = (data: Entity): string => {
  return JSON.stringify(data, (key, value) => {
    if (key === "id" && value <= 0) {
      return undefined;
    }

    return value;
  });
};

export const request = async <T extends Entity>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> => {
  const headers = prepareHeaders(options.headers as Record<string, string>);

  return sendRequest<T>(url, options, headers);
};

export const requestAuthorized = async <T extends Entity>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> => {
  let token = "";
  const storedData = localStorage.getItem("security");
  if (storedData) {
    try {
      const { token: storedToken } = JSON.parse(storedData);
      token = storedToken;
    } catch (error) {
      console.error("Error parsing token from localStorage:", error);
    }
  }

  const headers = prepareHeaders(options.headers as Record<string, string>, token);

  return sendRequest<T>(url, options, headers);
};
