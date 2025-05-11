import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { DayPosition } from "../../types/schedule";

/**
 * Получить позиции учебного дня в учебной неделе
 */
export const getDayPositions = async (positionIds: number[]): Promise<ApiResult<DayPosition[]>> => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/day-position?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить позиции учебного дня в учебной неделе
 */
export const setDayPositions = async (positions: DayPosition[]): Promise<void> => {
  await requestAuthorized("/schedule/day-position", {
    method: "POST",
    body: prepareBody(positions),
  });
};

/**
 * Удалить позиции учебного дня в учебной неделе
 */
export const deleteDayPositions = async (positionIds: number[]): Promise<void> => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/day-position?${params}`, {
    method: "DELETE",
  });
};
