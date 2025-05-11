import { requestAuthorized } from "../../utils/api";

/**
 * Получить позиции учебных предметов
 * @param {*} positionIds
 * @returns
 */
export const getSubjectPositions = async (positionIds) => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject-position?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить позиции учебных предметов
 * @param {*} positions
 * @returns
 */
export const setSubjectPositions = async (positions) => {
  return await requestAuthorized("/schedule/subject-position", {
    method: "POST",
    body: JSON.stringify(positions)
  });
};

/**
 * Удалить позиции учебных предметов
 * @param {*} positionIds
 * @returns
 */
export const deleteSubjectPositions = async (positionIds) => {
  const params = positionIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject-position?" + params, {
    method: "DELETE"
  });
};
