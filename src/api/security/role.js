import { request, requestAuthorized } from "../../utils/api";

/**
 * Получить роли
 * @param {*} roleIds
 * @returns
 */
export const getRoles = async (roleIds) => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/role?" + params, {
    method: "GET"
  });
};

/**
 * Получить роль по умолчанию
 * @returns
 */
export const getDefaultRole = async () => {
  return await requestAuthorized("/security/role/default", {
    method: "GET"
  });
};

/**
 * Получить роли по ID аккаунтов
 * @param {*} accountIds
 * @returns
 */
export const getRoleByAccounts = async (accountIds) => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/role/account?" + params, {
    method: "GET"
  });
};

/**
 * Получить роли по разрешениям
 * @param {*} permissions
 * @returns
 */
export const getRoleByPermissions = async (permissions) => {
  const params = permissions.map((permission) => `permissions=${permission}`).join("&");

  return await requestAuthorized("/security/role/permission?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить роли
 * @param {*} roles
 * @returns
 */
export const setRoles = async (roles) => {
  return await requestAuthorized("/security/role?" + params, {
    method: "POST",
    body: JSON.stringify(roles)
  });
};

/**
 * Удалить роли
 * @param {*} roleIds
 * @returns
 */
export const deleteRoles = async (roleIds) => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/role?" + params, {
    method: "DELETE"
  });
}
