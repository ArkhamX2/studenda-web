import { request, requestAuthorized } from "../../utils/api";

/**
 * Получить позиции учебного дня в учебной неделе
 * @param {*} positionIds
 * @returns
 */
export const getDayPositions = async (positionIds) => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/day-position?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить позиции учебного дня в учебной неделе
 * @param {*} positions
 * @returns
 */
export const setDayPositions = async (positions) => {
  return await requestAuthorized("/schedule/day-position", {
    method: "POST",
    body: JSON.stringify(positions)
  });
};

/**
 * Удалить позиции учебного дня в учебной неделе
 * @param {*} positionIds
 * @returns
 */
export const deleteDayPositions = async (positionIds) => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/day-position?" + params, {
    method: "DELETE"
  });
}
