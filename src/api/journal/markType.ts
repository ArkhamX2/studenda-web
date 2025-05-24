import { requestAuthorized, prepareBody, ApiResult } from "../../utils/api";
import { MarkType } from "../../types/journal";

/**
 * Получить типы оценок
 */
export const getMarkTypes = async (markTypeIds: number[]): Promise<ApiResult<MarkType[]>> => {
  const params = markTypeIds.map((id) => `ids=${id}`).join("&");

  return await requestAuthorized(`/journal/mark-type?${params}`, {
    method: "GET",
  });
};

/**
 * Создать или обновить типы оценок
 */
export const setMarkTypes = async (markTypes: MarkType[]): Promise<void> => {
  await requestAuthorized("/journal/mark-type", {
    method: "POST",
    body: prepareBody(markTypes),
  });
};

/**
 * Удалить типы оценок
 */
export const deleteMarkTypes = async (markTypeIds: number[]): Promise<void> => {
  const params = markTypeIds.map((id) => `ids=${id}`).join("&");

  await requestAuthorized(`/journal/mark-type?${params}`, {
    method: "DELETE",
  });
};
