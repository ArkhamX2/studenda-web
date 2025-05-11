import { requestAuthorized } from "../../utils/api";

/**
 * Получить занятия
 * @param {*} subjectIds
 * @returns
 */
export const getSubjects = async (subjectIds) => {
  const params = subjectIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject?" + params, {
    method: "GET"
  });
};

/**
 * Получить все занятия по ID группы
 * @param {*} groupId
 * @returns
 */
export const getAllSubjectByGroup = async (groupId, year) => {
  return await requestAuthorized(`/schedule/subject/group-all?groupId=${groupId}&year=${year}`, {
    method: "GET"
  });
};

/**
 * Получить занятия по ID группы
 * @param {*} groupId
 * @returns
 */
export const getSubjectByGroup = async (groupId, weekTypeId, year) => {
  return await requestAuthorized(`/schedule/subject/group?groupId=${groupId}&weekTypeId=${weekTypeId}&year=${year}`, {
    method: "GET"
  });
};

/**
 * Получить все занятия по ID аккаунта
 * @param {*} accountId
 * @returns
 */
export const getAllSubjectByAccount = async (accountId, year) => {
  return await requestAuthorized(`/schedule/subject/account-all?accountId=${accountId}&year=${year}`, {
    method: "GET"
  });
};

/**
 * Получить занятия по ID аккаунта
 * @param {*} accountId
 * @returns
 */
export const getSubjectByAccount = async (accountId, weekTypeId, year) => {
  return await requestAuthorized(`/schedule/subject/account?accountId=${accountId}&weekTypeId=${weekTypeId}&year=${year}`, {
    method: "GET"
  });
};

/**
 * Создать или обновить занятия
 * @param {*} subjects
 * @returns
 */
export const setSubjects = async (subjects) => {
  return await requestAuthorized("/schedule/subject", {
    method: "POST",
    body: JSON.stringify(subjects)
  });
};

/**
 * Удалить занятия
 * @param {*} subjectIds
 * @returns
 */
export const deleteSubjects = async (subjectIds) => {
  const params = subjectIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/schedule/subject?" + params, {
    method: "DELETE"
  });
};
