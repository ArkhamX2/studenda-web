import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { Task } from "../../types/journal";

/**
 * Получить задания
 */
export const getTasks = async (taskIds: number[]): Promise<ApiResult<Task[]>> => {
  const params = taskIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/journal/task?${params}`, {
    method: "GET",
  });
};

/**
 * Получить задания по ID аккаунта издателя
 */
export const getTaskByIssuer = async (
  issuerAccountId: number,
  groupIds: number[],
  disciplineId: number,
  subjectTypeId: number,
  academicYear: number
): Promise<ApiResult<Task[]>> => {
  const params = groupIds.map((id) => `groupIds=${id}`).join("&");

  return await requestAuthorized(
    `/journal/task/issuer?issuerAccountId=${issuerAccountId}&${params}&disciplineId=${disciplineId}&subjectTypeId=${subjectTypeId}&academicYear=${academicYear}`,
    {
      method: "GET",
    }
  );
};

/**
 * Получить задания по ID аккаунтов исполнителей
 */
export const getTaskByAssignee = async(
  assigneeAccountIds: number[],
  disciplineId: number,
  subjectTypeId: number,
  academicYear: number
): Promise<ApiResult<Task[]>> => {
  const params = assigneeAccountIds.map((id) => `assigneeAccountIds=${id}`).join("&");

  return await requestAuthorized(
    `/journal/task/assignee?${params}&disciplineId=${disciplineId}&subjectTypeId=${subjectTypeId}&academicYear=${academicYear}`,
    {
      method: "GET",
    }
  );
};

/**
 * Создать или обновить задания
 */
export const setTasks = async (tasks: Task[]): Promise<void> => {
  await requestAuthorized("/journal/task", {
    method: "POST",
    body: prepareBody(tasks),
  });
};

/**
 * Удалить задания
 */
export const deleteTasks = async (taskIds: number[]): Promise<void> => {
  const params = taskIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/journal/task?${params}`, {
    method: "DELETE",
  });
};
