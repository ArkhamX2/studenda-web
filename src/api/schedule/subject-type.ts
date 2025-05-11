import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { SubjectType } from "../../types/schedule";

/**
 * Получить типы учебных предметов
 */
export const getSubjectTypes = async (typeIds: number[]): Promise<ApiResult<SubjectType[]>> => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/subject-type?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить типы учебных предметов
 */
export const setSubjectTypes = async (types: SubjectType[]): Promise<void> => {
  await requestAuthorized("/schedule/subject-type", {
    method: "POST",
    body: prepareBody(types),
  });
};

/**
 * Удалить типы учебных предметов
 */
export const deleteSubjectTypes = async (typeIds: number[]): Promise<void> => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/subject-type?${params}`, {
    method: "DELETE",
  });
};
