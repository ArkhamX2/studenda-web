import { requestAuthorized } from "../../utils/api";

/**
 * Получить учебные дисциплины
 * @param {*} disciplineIds
 * @returns
 */
export const getDisciplines = async (disciplineIds) => {
  const params = disciplineIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/discipline?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить учебные дисциплины
 * @param {*} disciplines
 * @returns
 */
export const setDisciplines = async (disciplines) => {
  return await requestAuthorized("/schedule/discipline", {
    method: "POST",
    body: JSON.stringify(disciplines)
  });
};

/**
 * Удалить учебные дисциплины
 * @param {*} disciplineIds
 * @returns
 */
export const deleteDisciplines = async (disciplineIds) => {
  const params = disciplineIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/discipline?" + params, {
    method: "DELETE"
  });
};
