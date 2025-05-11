import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { WeekType } from "../../types/schedule";

/**
 * Получить типы учебных недель
 */
export const getWeekTypes = async (typeIds: number[]): Promise<ApiResult<WeekType[]>> => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/schedule/week-type?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить типы учебных недель
 */
export const setWeekTypes = async (types: WeekType[]): Promise<void> => {
  await requestAuthorized("/schedule/week-type", {
    method: "POST",
    body: prepareBody(types),
  });
};

/**
 * Удалить типы учебных недель
 */
export const deleteWeekTypes = async (typeIds: number[]): Promise<void> => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/schedule/week-type?${params}`, {
    method: "DELETE",
  });
};
