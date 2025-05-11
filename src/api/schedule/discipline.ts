import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Discipline } from "../../types/schedule";

/**
 * Получить учебные дисциплины
 */
export const getDisciplines = async (disciplineIds: number[]): Promise<ApiResult<Discipline[]>> => {
  const params = disciplineIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/discipline?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить учебные дисциплины
 */
export const setDisciplines = async (disciplines: Discipline[]): Promise<void> => {
  await requestAuthorized("/schedule/discipline", {
    method: "POST",
    body: prepareBody(disciplines),
  });
};

/**
 * Удалить учебные дисциплины
 */
export const deleteDisciplines = async (disciplineIds: number[]): Promise<void> => {
  const params = disciplineIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/discipline?${params}`, {
    method: "DELETE",
  });
};
