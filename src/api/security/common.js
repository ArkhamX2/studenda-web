import { request, requestAuthorized } from "../../utils/api";

/**
 * Получить настройки
 * @returns
 */
export const fetchSettings = async () => {
  return await request("/security", {
    method: "GET"
  });
};

/**
 * Авторизовать пользователя
 * @param {*} email
 * @param {*} password
 * @returns
 */
export const login = async (email, password) => {
  return await request("/security/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Зарегистрировать пользователя
 * @param {*} email
 * @param {*} password
 * @param {*} account
 * @returns
 */
export const register = async (email, password, account) => {
  return await request("/security/register", {
    method: "POST",
    body: JSON.stringify({ email, password, account }),
  });
};

/**
 * Создать нового пользователя
 * @param {*} email
 * @param {*} password
 * @param {*} account
 * @returns
 */
export const createUser = async (email, password, account) => {
  return await requestAuthorized("/security/user", {
    method: "POST",
    body: JSON.stringify({ email, password, account }),
  });
};

/**
 * Проверить токен пользователя
 * @param {*} token
 * @returns
 */
export const validateToken = async (token) => {
  return await request("/security/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
