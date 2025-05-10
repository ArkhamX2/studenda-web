import { requestAuthorized } from "../../utils/api";

/**
 * Получить аккаунты
 * @param {*} accountIds
 * @returns
 */
export const getAccounts = async (accountIds) => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/account?" + params, {
    method: "GET"
  });
};

/**
 * Получить аккаунты по ID групп
 * @param {*} groupIds
 * @returns
 */
export const getAccountByGroups = async (groupIds) => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/account/group?" + params, {
    method: "GET"
  });
};

/**
 * Получить аккаунты по ID ролей
 * @param {*} roleIds
 * @returns
 */
export const getAccountByRoles = async (roleIds) => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/account/role?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить аккаунты
 * @param {*} accounts
 * @returns
 */
export const setAccounts = async (accounts) => {
  return await requestAuthorized("/security/account", {
    method: "POST",
    body: JSON.stringify(accounts)
  });
};

/**
 * Удалить аккаунты
 * @param {*} accountIds
 * @returns
 */
export const deleteAccounts = async (accountIds) => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/security/account?" + params, {
    method: "DELETE"
  });
}
