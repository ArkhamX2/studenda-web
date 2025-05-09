import { requestAuthorized } from "../utils/api";

/**
 * Получить курсы
 * @param {*} courseIds
 * @returns
 */
export const getCourses = async (courseIds) => {
  const params = courseIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/course?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить курсы
 * @param {*} courses
 * @returns
 */
export const setCourses = async (courses) => {
  return await requestAuthorized("/course?" + params, {
    method: "POST",
    body: JSON.stringify(courses)
  });
};

/**
 * Удалить курсы
 * @param {*} courseIds
 * @returns
 */
export const deleteCourses = async (courseIds) => {
  const params = courseIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/course?" + params, {
    method: "DELETE"
  });
}

/**
 * Получить факультеты
 * @param {*} departmentIds
 * @returns
 */
export const getDepartments = async (departmentIds) => {
  const params = departmentIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/department?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить факультеты
 * @param {*} departments
 * @returns
 */
export const setDepartments = async (departments) => {
  return await requestAuthorized("/department", {
    method: "POST",
    body: JSON.stringify(departments)
  });
}

/**
 * Удалить факультеты
 * @param {*} departmentIds
 * @returns
 */
export const deleteDepartments = async (departmentIds) => {
  const params = departmentIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/department?" + params, {
    method: "DELETE"
  });
}

/**
 * Получить группы
 * @param {*} groupIds
 * @returns
 */
export const getGroups = async (groupIds) => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/group?" + params, {
    method: "GET"
  });
};

/**
 * Создать или обновить группы
 * @param {*} groups
 * @returns
 */
export const setGroups = async (groups) => {
  return await requestAuthorized("/group", {
    method: "POST",
    body: JSON.stringify(groups)
  });
};

/**
 * Удалить группы
 * @param {*} groupIds
 * @returns
 */
export const deleteGroups = async (groupIds) => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized("/group?" + params, {
    method: "DELETE"
  });
};
