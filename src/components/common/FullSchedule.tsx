import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from "@mui/icons-material/School";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useNavigate } from "react-router-dom";

import { useSettings } from "../SettingsProvider";
import { getDayPositions } from "../../api/schedule/dayPosition";
import { getSubjectPositions } from "../../api/schedule/subject-position";
import { getDisciplines } from "../../api/schedule/discipline";
import { getSubjectTypes } from "../../api/schedule/subject-type";
import { getWeekTypes } from "../../api/schedule/week-type";
import { getSubjectByAccount, getSubjectByGroup } from "../../api/schedule/subject";
import { DayPosition, SubjectPosition, Subject, Discipline, SubjectType, WeekType } from "../../types/schedule";

dayjs.extend(weekOfYear);
dayjs.locale('ru');

function getWeekTypeByNumber(weekTypes: WeekType[], weekNum: number): WeekType | undefined {
  if (!weekTypes.length) return undefined;
  const sorted = weekTypes.slice().sort((a, b) => a.index - b.index);
  const idx = (weekNum - 1) % sorted.length;
  return sorted[idx];
}

const FullSchedule: React.FC<{ mode: 'teacher' | 'student', accountId?: number, groupId?: number }> = ({ mode, accountId, groupId }) => {
  const settings = useSettings();
  const [baseDate, setBaseDate] = useState(() =>
    settings?.coordinatedUniversalTime ? dayjs(settings.coordinatedUniversalTime).startOf("week") : dayjs().startOf("week")
  );
  const navigate = useNavigate();

  const [dayPositions, setDayPositions] = useState<DayPosition[]>([]);
  const [subjectPositions, setSubjectPositions] = useState<SubjectPosition[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>([]);
  const [weekTypes, setWeekTypes] = useState<WeekType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const weekNum = baseDate.week(); // Понедельник - первая неделя
  const year = baseDate.year();
  const weekType = getWeekTypeByNumber(weekTypes, weekNum);

  useEffect(() => {
    getDayPositions([]).then(resp => setDayPositions(resp.data || []));
    getSubjectPositions([]).then(resp => setSubjectPositions(resp.data || []));
    getDisciplines([]).then(resp => setDisciplines(resp.data || []));
    getSubjectTypes([]).then(resp => setSubjectTypes(resp.data || []));
    getWeekTypes([]).then(resp => setWeekTypes(resp.data || []));
  }, []);

  useEffect(() => {
    if (!weekType) return setSubjects([]);
    if (mode === 'teacher' && accountId) {
      getSubjectByAccount(accountId, weekType.id, year).then(resp => setSubjects(resp.data || []));
    } else if (mode === 'student' && groupId) {
      getSubjectByGroup(groupId, weekType.id, year).then(resp => setSubjects(resp.data || []));
    } else {
      setSubjects([]);
    }
  }, [mode, accountId, groupId, weekType?.id, year]);

  const handlePrevWeek = () => setBaseDate(d => d.subtract(1, "week"));
  const handleNextWeek = () => setBaseDate(d => d.add(1, "week"));

  const getSubject = (dayId: number, posId: number) =>
    weekType ? subjects.find(s => s.dayPositionId === dayId && s.subjectPositionId === posId && s.weekTypeId === weekType.id) : undefined;

  const orderedDayPositions = dayPositions.slice().sort((a, b) => a.index - b.index);
  const orderedSubjectPositions = subjectPositions.slice().sort((a, b) => a.index - b.index);

  return (
    <Box>
      <Paper sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 3, gap: 2, borderRadius: 3 }}>
        <IconButton onClick={handlePrevWeek}><ArrowBackIosNewIcon /></IconButton>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Неделя {baseDate.week()} ({weekType ? weekType.name : '—'})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Корректно вычисляем начало и конец недели: понедельник - воскресенье */}
            {baseDate.startOf('week').format('DD.MM.YYYY')} – {baseDate.endOf('week').format('DD.MM.YYYY')}
          </Typography>
        </Box>
        <IconButton onClick={handleNextWeek}><ArrowForwardIosIcon /></IconButton>
        <Box sx={{ flex: 1 }} />
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <CalendarTodayIcon />
        </Avatar>
      </Paper>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        maxWidth: 1280,
        mx: 'auto',
      }}>
        {orderedDayPositions.map((day) => (
          <Box
            key={day.id}
            sx={{
              flex: '1 1 320px',
              minWidth: 280,
              maxWidth: 400,
              mb: 2,
              width: {
                xs: '100%',
                sm: 'calc(50% - 16px)',
                md: 'calc(33.333% - 16px)'
              },
              cursor: 'pointer',
              borderRadius: 3,
              boxShadow: 2,
              background: '#fff',
              transition: 'box-shadow 0.2s, background 0.2s, transform 0.1s',
              '&:hover': {
                boxShadow: 8,
                transform: 'translateY(-2px) scale(1.02)',
              },
              '&:active': {
                boxShadow: 4,
                transform: 'scale(0.98)',
              },
              '& .ClickableCard': { pointerEvents: 'none' },
            }}
            onClick={() => {
              const dateStr = baseDate.startOf('week').add(day.index, 'day').format('YYYY-MM-DD');
              if (weekType && day.id && year) {
                if (mode === 'student') {
                  navigate(`/student/schedule/day/${dateStr}/${weekType.id}/${day.id}/${year}`);
                } else {
                  navigate(`/teacher/schedule/day/${dateStr}/${weekType.id}/${day.id}/${year}`);
                }
              }
            }}
          >
            <Card className="ClickableCard" sx={{ borderRadius: 3, minHeight: 220, display: 'flex', flexDirection: 'column', mb: 2, boxShadow: 'none', background: 'transparent' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>{day.name}</Typography>
                {orderedSubjectPositions.map(pos => {
                  const subject = getSubject(day.id, pos.id);
                  const discipline = subject && disciplines.find(d => d.id === subject.disciplineId);
                  const subjectType = subject && subjectTypes.find(t => t.id === subject.subjectTypeId);
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
