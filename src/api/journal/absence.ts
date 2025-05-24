import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Absence } from "../../types/journal";

/**
 * Получить прогулы
 */
export const getAbsences = async (absenceIds: number[]): Promise<ApiResult<Absence[]>> => {
  const params = absenceIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/journal/absence?${params}`, {
    method: "GET",
  });
};

/**
 * Получить прогулы по ID аккаунта
 */
export const getAbsenceByAccount = async (accountId: number, sessionIds: number[]): Promise<ApiResult<Absence[]>> => {
  const params = sessionIds.map((id) => `sessionIds=${id}`).join("&");

  return await requestAuthorized(`/journal/absence/account?accountId=${accountId}&` + params, {
    method: "GET",
  });
};

/**
 * Получить прогулы по ID учебной сессии
 */
export const getAbsenceBySession = async (sessionId: number, accountIds: number[]): Promise<ApiResult<Absence[]>> => {
  const params = accountIds.map((id) => `accountIds=${id}`).join("&");

  return await requestAuthorized(`/journal/absence/session?sessionId=${sessionId}&` + params, {
    method: "GET",
  });
};

/**
 * Создать или обновить прогулы
 */
export const setAbsences = async (absences: Absence[]): Promise<void> => {
  await requestAuthorized("/journal/absence", {
    method: "POST",
    body: prepareBody(absences),
  });
};

/**
 * Удалить прогулы
 */
export const deleteAbsences = async (absenceIds: number[]): Promise<void> => {
  const params = absenceIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/journal/absence?${params}`, {
    method: "DELETE",
  });
};
