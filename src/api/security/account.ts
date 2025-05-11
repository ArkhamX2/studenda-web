import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Account } from "../../types/security";

/**
 * Получить аккаунты
 */
export const getAccounts = async (accountIds: number[]): Promise<ApiResult<Account[]>> => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/security/account?${params}`, {
    method: "GET",
  });
};

/**
 * Получить аккаунты по ID групп
 */
export const getAccountByGroups = async (groupIds: number[]): Promise<ApiResult<Account[]>> => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/security/account/group?${params}`, {
    method: "GET",
  });
};

/**
 * Получить аккаунты по ID ролей
 */
export const getAccountByRoles = async (roleIds: number[]): Promise<ApiResult<Account[]>> => {
  const params = roleIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/security/account/role?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить аккаунты
 */
export const setAccounts = async (accounts: Account[]): Promise<void> => {
  await requestAuthorized("/security/account", {
    method: "POST",
    body: prepareBody(accounts),
  });
};

/**
 * Удалить аккаунты
 */
export const deleteAccounts = async (accountIds: number[]): Promise<void> => {
  const params = accountIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/security/account?${params}`, {
    method: "DELETE",
  });
};
