import { requestAuthorized } from "../../utils/api";

/**
 * Получить типы учебных предметов
 * @param {*} typeIds
 * @returns
 */
export const getSubjectTypes = async (typeIds) => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject-type?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить типы учебных предметов
 * @param {*} types
 * @returns
 */
export const setSubjectTypes = async (types) => {
  return await requestAuthorized("/schedule/subject-type", {
    method: "POST",
    body: JSON.stringify(types)
  });
};

/**
 * Удалить типы учебных предметов
 * @param {*} typeIds
 * @returns
 */
export const deleteSubjectTypes = async (typeIds) => {
  const params = typeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject-type?" + params, {
    method: "DELETE"
  });
};
