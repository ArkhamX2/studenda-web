import { request, requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Settings, AuthResponse, Account } from "../../types/security";

/**
 * Получить настройки
 */
export const fetchSettings = async (): Promise<ApiResult<Settings>> => {
  return await request("/security", {
    method: "GET",
  });
};

/**
 * Авторизовать пользователя
 */
export const login = async (email: string, password: string): Promise<ApiResult<AuthResponse>> => {
  return await request("/security/login", {
    method: "POST",
    body: prepareBody({ email, password }),
  });
};

/**
 * Зарегистрировать пользователя
 */
export const register = async (email: string, password: string, account: Account): Promise<ApiResult<AuthResponse>> => {
  return await request("/security/register", {
    method: "POST",
    body: prepareBody({ email, password, account }),
  });
};

/**
 * Создать нового пользователя
 */
export const createUser = async (email: string, password: string, account: Account): Promise<ApiResult<AuthResponse>> => {
  return await requestAuthorized("/security/user", {
    method: "POST",
    body: prepareBody({ email, password, account }),
  });
};

/**
 * Проверить токен пользователя
 */
export const validateToken = async (token: string): Promise<ApiResult<AuthResponse>> => {
  return await request("/security/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Изменить пароль текущего авторизованного пользователя
 */
export const changePassword = async (password: string): Promise<ApiResult<AuthResponse>> => {
  return await requestAuthorized("/security/password", {
    method: "POST",
    body: prepareBody({ password }),
  });
};
