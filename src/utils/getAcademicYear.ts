import dayjs from 'dayjs';

/**
 * Возвращает текущий учебный год по дате (или сегодня).
 * Например, для 2025-05-28 вернёт 2024 (2024-2025 учебный год).
 * @param date - дата (по умолчанию сегодня)
 * @returns number - год начала учебного года
 */
export function getAcademicYear(date?: Date | string): number {
  const d = date ? dayjs(date) : dayjs();
  const year = d.year();
  const septemberFirst = dayjs(`${year}-09-01`);
  // Если дата раньше 1 сентября, учебный год начался в прошлом году
  if (d.isBefore(septemberFirst)) {
    return year - 1;
  }
  return year;
}
