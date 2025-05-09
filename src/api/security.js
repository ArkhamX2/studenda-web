import { request, requestAuthorized } from "../utils/api";

export const fetchSettings = async () => {
  return await request("/security", {
    method: "GET"
  });
};

export const login = async (email, password) => {
  return await request("/security/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const validateToken = async (token) => {
  return await request("/security/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};