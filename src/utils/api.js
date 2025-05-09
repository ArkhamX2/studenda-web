const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5255";

const prepareHeaders = (headers, token = null) => {
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

const sendRequest = async (url, options, headers) => {
  const result = { success: false, data: null };

  try {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      headers
    });

    result.success = response.ok;
    if (result.success) {
      result.data = await response.json();
    }
  } catch (error) {
    console.error("Error during request:", error);
  }

  return result;
}

export const request = async (url, options = {}) => {
  const headers = prepareHeaders(options.headers);

  return sendRequest(url, options, headers);
};

export const requestAuthorized = async (url, options = {}) => {
  const token = localStorage.getItem("jwtToken") || '';
  const headers = prepareHeaders(options.headers, token);

  return sendRequest(url, options, headers);
};
