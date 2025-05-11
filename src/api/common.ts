import { requestAuthorized, prepareBody, ApiResult } from "../utils/api";
import { Course, Department, Group } from "../types/common";

/**
 * Получить курсы
 */
export const getCourses = async (courseIds: number[]): Promise<ApiResult<Course[]>> => {
  const params = courseIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/course?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить курсы
 */
export const setCourses = async (courses: Course[]): Promise<void> => {
  await requestAuthorized("/course", {
    method: "POST",
    body: prepareBody(courses),
  });
};

/**
 * Удалить курсы
 */
export const deleteCourses = async (courseIds: number[]): Promise<void> => {
  const params = courseIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/course?${params}`, {
    method: "DELETE",
  });
};

/**
 * Получить факультеты
 */
export const getDepartments = async (departmentIds: number[]): Promise<ApiResult<Department[]>> => {
  const params = departmentIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/department?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить факультеты
 */
export const setDepartments = async (departments: Department[]): Promise<void> => {
  await requestAuthorized("/department", {
    method: "POST",
    body: prepareBody(departments),
  });
};

/**
 * Удалить факультеты
 */
export const deleteDepartments = async (departmentIds: number[]): Promise<void> => {
  const params = departmentIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/department?${params}`, {
    method: "DELETE",
  });
};

/**
 * Получить группы
 */
export const getGroups = async (groupIds: number[]): Promise<ApiResult<Group[]>> => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/group?${params}`, {
    method: "GET",
  });
};

/**
 * Получить группы по ID факультета
 */
export const getGroupsByDepartment = async (departmentId: number): Promise<ApiResult<Group[]>> => {
  return await requestAuthorized(`/group/department?departmentId=${departmentId}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить группы
 */
export const setGroups = async (groups: Group[]): Promise<void> => {
  await requestAuthorized("/group", {
    method: "POST",
    body: prepareBody(groups),
  });
};

/**
 * Удалить группы
 */
export const deleteGroups = async (groupIds: number[]): Promise<void> => {
  const params = groupIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/group?${params}`, {
    method: "DELETE",
  });
};
