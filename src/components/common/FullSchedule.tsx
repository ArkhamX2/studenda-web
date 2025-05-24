import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { DayPosition, SubjectPosition, Subject, Discipline, SubjectType, WeekType } from "../../types/schedule";

// --- MOCK DATA GENERATION ---
const mockDayPositions: DayPosition[] = [
  { id: 1, index: 0, name: "Понедельник" },
  { id: 2, index: 1, name: "Вторник" },
  { id: 3, index: 2, name: "Среда" },
  { id: 4, index: 3, name: "Четверг" },
  { id: 5, index: 4, name: "Пятница" },
  { id: 6, index: 5, name: "Суббота" },
  { id: 7, index: 6, name: "Воскресенье" },
];
const mockSubjectPositions: SubjectPosition[] = [
  { id: 1, index: 0, startLabel: "08:30", endLabel: "10:00", name: "1 пара" },
  { id: 2, index: 1, startLabel: "10:10", endLabel: "11:40", name: "2 пара" },
  { id: 3, index: 2, startLabel: "12:10", endLabel: "13:40", name: "3 пара" },
  { id: 4, index: 3, startLabel: "13:50", endLabel: "15:20", name: "4 пара" },
];
const mockDisciplines: Discipline[] = [
  { id: 1, accountId: 1, name: "Математика", description: "Высшая математика" },
  { id: 2, accountId: 1, name: "Физика", description: "Общая физика" },
  { id: 3, accountId: 1, name: "Информатика", description: "Программирование" },
];
const mockSubjectTypes: SubjectType[] = [
  { id: 1, name: "Лекция" },
  { id: 2, name: "Практика" },
];
const mockWeekTypes: WeekType[] = [
  { id: 1, index: 0, name: "Чётная" },
  { id: 2, index: 1, name: "Нечётная" },
];

dayjs.extend(weekOfYear);

function getWeekTypeByDate(date: Dayjs) {
  // Пример: чётная/нечётная неделя по номеру недели года
  const weekNum = date.week();
  return mockWeekTypes[weekNum % 2];
}

function generateMockSubjects(weekTypeId: number, year: number): Subject[] {
  // Для примера: рандомно заполняем расписание
  const subjects: Subject[] = [];
  for (const day of mockDayPositions) {
    for (const pos of mockSubjectPositions) {
      if (Math.random() > 0.5) {
        subjects.push({
          id: Math.floor(Math.random() * 100000),
          disciplineId: mockDisciplines[Math.floor(Math.random() * mockDisciplines.length)].id,
          subjectPositionId: pos.id,
          dayPositionId: day.id,
          weekTypeId,
          subjectTypeId: mockSubjectTypes[Math.floor(Math.random() * mockSubjectTypes.length)].id,
          accountId: 1,
          groupId: 1,
          academicYear: year,
          classroom: `Ауд. ${Math.floor(Math.random() * 300 + 100)}`,
          description: "Тема занятия, преподаватель, описание...",
        });
      }
    }
  }
  return subjects;
}

const FullSchedule: React.FC = () => {
  const [baseDate, setBaseDate] = useState(dayjs().startOf("week")); // начало недели (понедельник)

  // Определяем тип недели и год
  const weekType = getWeekTypeByDate(baseDate);
  const year = baseDate.year();

  // Моки занятий на неделю
  const subjects = useMemo(() => generateMockSubjects(weekType.id, year), [weekType.id, year, baseDate]);

  // Переключение недели
  const handlePrevWeek = () => setBaseDate(d => d.subtract(1, "week"));
  const handleNextWeek = () => setBaseDate(d => d.add(1, "week"));

  // Для каждой позиции дня ищем занятие
  const getSubject = (dayId: number, posId: number) =>
    subjects.find(s => s.dayPositionId === dayId && s.subjectPositionId === posId && s.weekTypeId === weekType.id);

  // Сортируем дни и позиции занятий по индексу
  const orderedDayPositions = mockDayPositions.slice().sort((a, b) => a.index - b.index);
  const orderedSubjectPositions = mockSubjectPositions.slice().sort((a, b) => a.index - b.index);

  return (
    <Box>
      {/* Header: неделя, дата, навигация */}
      <Paper sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 3, gap: 2, borderRadius: 3 }}>
        <IconButton onClick={handlePrevWeek}><ArrowBackIosNewIcon /></IconButton>
        <Box>
          <Typography variant="h6" fontWeight={700}>Неделя {baseDate.week()} ({weekType.name})</Typography>
          <Typography variant="body2" color="text.secondary">
            {baseDate.startOf('week').format('DD.MM.YYYY')} – {baseDate.endOf('week').format('DD.MM.YYYY')}
          </Typography>
        </Box>
        <IconButton onClick={handleNextWeek}><ArrowForwardIosIcon /></IconButton>
        <Box sx={{ flex: 1 }} />
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <CalendarTodayIcon />
        </Avatar>
      </Paper>
      {/* Сетка дней недели без Grid */}
      <Box sx={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  justifyContent: 'center',
  maxWidth: 1280,
  mx: 'auto', // центрируем страницу
}}>
        {orderedDayPositions.map((day, idx) => (
          <Box
            key={day.id}
            sx={{
              flex: '1 1 320px',
              minWidth: 280,
              maxWidth: 400,
              mb: 2,
              // Ограничиваем максимум 3 карточки в строке
              width: {
                xs: '100%',
                sm: 'calc(50% - 16px)',
                md: 'calc(33.333% - 16px)'
              },
            }}
          >
            <Card sx={{ borderRadius: 3, minHeight: 220, display: 'flex', flexDirection: 'column', mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{day.name}</Typography>
                {orderedSubjectPositions.map(pos => {
                  const subject = getSubject(day.id, pos.id);
                  const discipline = subject && mockDisciplines.find(d => d.id === subject.disciplineId);
                  const subjectType = subject && mockSubjectTypes.find(t => t.id === subject.subjectTypeId);
                  return (
                    <Box key={pos.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, borderRadius: 2, bgcolor: subject ? 'rgba(25,118,210,0.07)' : '#f5f5f5' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: subject ? 'primary.main' : 'grey.200', color: subject ? '#fff' : 'grey.700' }}>
                        <SchoolIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ minWidth: 80 }}>
                        <Typography variant="caption" color="text.secondary">
                          {pos.startLabel} – {pos.endLabel}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {subjectType?.name || '—'}
                        </Typography>
                      </Box>
                      {subject ? (
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{discipline?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{subject.classroom}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ ml: 2 }}>
                          —
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FullSchedule;
