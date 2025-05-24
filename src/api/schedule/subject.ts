import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Subject } from "../../types/schedule";

/**
 * Получить занятия
 */
export const getSubjects = async (subjectIds: number[]): Promise<ApiResult<Subject[]>> => {
  const params = subjectIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/subject?${params}`, {
    method: "GET",
  });
};

/**
 * Получить занятия по ID группы
 */
export const getSubjectByGroup = async (groupId: number, weekTypeId: number, year: number): Promise<ApiResult<Subject[]>> => {
  return await requestAuthorized(`/schedule/subject/group?groupId=${groupId}&weekTypeId=${weekTypeId}&year=${year}`, {
    method: "GET",
  });
};

/**
 * Получить занятия по ID аккаунта
 */
export const getSubjectByAccount = async (accountId: number, weekTypeId: number, year: number): Promise<ApiResult<Subject[]>> => {
  return await requestAuthorized(`/schedule/subject/account?accountId=${accountId}&weekTypeId=${weekTypeId}&year=${year}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить занятия
 */
export const setSubjects = async (subjects: Subject[]): Promise<void> => {
  await requestAuthorized("/schedule/subject", {
    method: "POST",
    body: prepareBody(subjects),
  });
};

/**
 * Удалить занятия
 */
export const deleteSubjects = async (subjectIds: number[]): Promise<void> => {
  const params = subjectIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/subject?${params}`, {
    method: "DELETE",
  });
};
