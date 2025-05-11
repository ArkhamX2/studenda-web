import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { SubjectPosition } from "../../types/schedule";

/**
 * Получить позиции учебных предметов
 */
export const getSubjectPositions = async (positionIds: number[]): Promise<ApiResult<SubjectPosition[]>> => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/subject-position?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить позиции учебных предметов
 */
export const setSubjectPositions = async (positions: SubjectPosition[]): Promise<void> => {
  await requestAuthorized("/schedule/subject-position", {
    method: "POST",
    body: prepareBody(positions),
  });
};

/**
 * Удалить позиции учебных предметов
 */
export const deleteSubjectPositions = async (positionIds: number[]): Promise<void> => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/subject-position?${params}`, {
    method: "DELETE",
  });
};
