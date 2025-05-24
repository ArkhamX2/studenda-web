import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Session } from "../../types/journal";

/**
 * Получить учебные сессии
 */
export const getSessions = async (sessionIds: number[]): Promise<ApiResult<Session[]>> => {
  const params = sessionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/journal/session?${params}`, {
    method: "GET",
  });
};

/**
 * Получить учебные сессии по ID занятия
 */
export const getSessionBySubject = async (subjectId: number, dates: string[]): Promise<ApiResult<Session[]>> => {
  const params = dates.map((date) => `dates=${date}`).join("&");

  return await requestAuthorized(`/journal/session/subject?subjectId=${subjectId}&` + params, {
    method: "GET",
  });
};

/**
 * Получить учебные сессии по дате
 */
export const getSessionByDate = async (date: string, subjectIds: number[]): Promise<ApiResult<Session[]>> => {
  const params = subjectIds.map((id) => `subjectIds=${id}`).join("&");

  return await requestAuthorized(`/journal/session/date?date=${date}&` + params, {
    method: "GET",
  });
};

/**
 * Создать или обновить учебные сессии
 */
export const setSessions = async (sessions: Session[]): Promise<void> => {
  await requestAuthorized("/journal/session", {
    method: "POST",
    body: prepareBody(sessions),
  });
};

/**
 * Удалить учебные сессии
 */
export const deleteSessions = async (sessionIds: number[]): Promise<void> => {
  const params = sessionIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/journal/session?${params}`, {
    method: "DELETE",
  });
};
