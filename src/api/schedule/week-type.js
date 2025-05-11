import { requestAuthorized } from "../../utils/api";

/**
 * Получить типы учебных недель
 * @param {*} typeIds
 * @returns
 */
export const getWeekTypes = async (typeIds) => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/week-type?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить типы учебных недель
 * @param {*} types
 * @returns
 */
export const setWeekTypes = async (types) => {
  return await requestAuthorized("/schedule/week-type", {
    method: "POST",
    body: JSON.stringify(types)
  });
};

/**
 * Удалить типы учебных недель
 * @param {*} typeIds
 * @returns
 */
export const deleteWeekTypes = async (typeIds) => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/week-type?" + params, {
    method: "DELETE"
  });
};
