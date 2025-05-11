import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Role } from "../../types/security";

/**
 * Получить роли
 */
export const getRoles = async (roleIds: number[]): Promise<ApiResult<Role[]>> => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/security/role?${params}`, {
    method: "GET",
  });
};

/**
 * Получить роль по умолчанию
 */
export const getDefaultRole = async (): Promise<ApiResult<Role>> => {
  return await requestAuthorized("/security/role/default", {
    method: "GET",
  });
};

/**
 * Получить роли по ID аккаунтов
 */
export const getRoleByAccounts = async (accountIds: number[]): Promise<ApiResult<Role[]>> => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/security/role/account?${params}`, {
    method: "GET",
  });
};

/**
 * Получить роли по разрешениям
 */
export const getRoleByPermissions = async (permissions: string[]): Promise<ApiResult<Role[]>> => {
  const params = permissions.map((permission) => `permissions=${permission}`).join("&");

  return await requestAuthorized(`/security/role/permission?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить роли
 */
export const setRoles = async (roles: Role[]): Promise<void> => {
  await requestAuthorized("/security/role", {
    method: "POST",
    body: prepareBody(roles),
  });
};

/**
 * Удалить роли
 */
export const deleteRoles = async (roleIds: number[]): Promise<void> => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/security/role?${params}`, {
    method: "DELETE",
  });
};
