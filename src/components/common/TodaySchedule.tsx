import React, { useEffect, useState } from "react";
import { Box, Typography, Fade, Card, CardContent, CardActions, Button, Avatar } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import { getSubjectByAccount, getSubjectByGroup } from "../../api/schedule/subject";
import { getDisciplines } from "../../api/schedule/discipline";
import { getSubjectPositions } from "../../api/schedule/subject-position";
import { getDayPositions } from "../../api/schedule/dayPosition";
import { getSubjectTypes } from "../../api/schedule/subject-type";
import { useNavigate } from "react-router-dom";

interface TodayScheduleProps {
  mode: "teacher" | "student";
  accountId?: number;
  groupId?: number;
  weekTypeId: number;
  year: number;
  userName: string;
  date: Date;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ mode, accountId, groupId, weekTypeId, year, userName, date }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [related, setRelated] = useState<any>({
    disciplines: {},
    subjectPositions: {},
    dayPositions: {},
    subjectTypes: {},
  });
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ((mode === "teacher" && accountId) || (mode === "student" && groupId)) {
      const fetch = mode === "teacher"
        ? getSubjectByAccount(accountId!, weekTypeId, year)
        : getSubjectByGroup(groupId!, weekTypeId, year);
      fetch.then((resp) => {
        const subjects = resp.data || [];
        setSubjects(subjects);
        // Собираем id связанных сущностей
        const disciplineIds = Array.from(new Set(subjects.map((s: any) => s.disciplineId)));
        const subjectPositionIds = Array.from(new Set(subjects.map((s: any) => s.subjectPositionId)));
        const dayPositionIds = Array.from(new Set(subjects.map((s: any) => s.dayPositionId)));
        const subjectTypeIds = Array.from(new Set(subjects.map((s: any) => s.subjectTypeId)));
        Promise.all([
          getDisciplines(disciplineIds),
          getSubjectPositions(subjectPositionIds),
          getDayPositions(dayPositionIds),
          getSubjectTypes(subjectTypeIds),
        ]).then(([disc, pos, day, type]) => {
          setRelated({
            disciplines: (disc.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            subjectPositions: (pos.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            dayPositions: (day.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            subjectTypes: (type.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
          });
        });
      });
    }
  }, [mode, accountId, groupId, weekTypeId, year]);

  // Определяем текущий день недели и занятия на сегодня
  const todayDayPositionObj = Object.values(related.dayPositions).find((d: any) => d && typeof d === 'object' && 'index' in d && d.index === date.getDay());
  const todayDayPositionId = todayDayPositionObj && typeof todayDayPositionObj === 'object' && 'id' in todayDayPositionObj ? (todayDayPositionObj as any).id : undefined;
  const todaySubjects = todayDayPositionId ? subjects.filter((s: any) => s.dayPositionId === todayDayPositionId) : [];
  // Сортировка занятий по индексу позиции занятия
  const sortedTodaySubjects = todaySubjects.slice().sort((a: any, b: any) => {
    const posA = related.subjectPositions[a.subjectPositionId];
    const posB = related.subjectPositions[b.subjectPositionId];
    const indexA = posA ? (typeof posA.index === 'number' ? posA.index : (posA.order ?? 0)) : 0;
    const indexB = posB ? (typeof posB.index === 'number' ? posB.index : (posB.order ?? 0)) : 0;
    return indexA - indexB;
  });

  // Определяем текущее занятие по времени клиента
  const now = new Date();
  const getMinutes = (str: string) => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  };
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const getCurrentSubjectId = () => {
    for (const s of todaySubjects) {
      const pos = related.subjectPositions[s.subjectPositionId];
      if (pos && pos.startLabel && pos.endLabel) {
        const start = getMinutes(pos.startLabel);
        const end = getMinutes(pos.endLabel);
        if (nowMinutes >= start && nowMinutes < end) return s.id;
      }
    }
    return null;
  };
  const currentId = getCurrentSubjectId();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {todaySubjects.length === 0 ? (
        <Typography color="text.secondary">На сегодня занятий нет</Typography>
      ) : (
        sortedTodaySubjects.map((s: any) => {
          const discipline = related.disciplines[s.disciplineId];
          const subjectType = related.subjectTypes[s.subjectTypeId];
          const subjectPosition = related.subjectPositions[s.subjectPositionId];
          const isCurrent = s.id === currentId;
          const expandedThis = isCurrent || expanded === s.id;
          return (
            <Fade in key={s.id}>
              <Card
                elevation={isCurrent ? 8 : 2}
                sx={{
                  border: isCurrent ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  bgcolor: isCurrent ? 'rgba(25, 118, 210, 0.07)' : '#fff',
                  borderRadius: 3,
                  minHeight: 80,
                  transition: 'all 0.3s',
                  cursor: isCurrent ? 'default' : 'pointer',
                  boxShadow: isCurrent ? 8 : 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  if (!isCurrent) setExpanded(expanded === s.id ? null : s.id);
                }}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: isCurrent ? 'primary.main' : 'grey.200', color: isCurrent ? '#fff' : 'grey.800', width: 40, height: 40 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {subjectPosition ? `${subjectPosition.startLabel} - ${subjectPosition.endLabel}` : ''}
                      </Typography>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        {discipline?.name || '—'} <span style={{ fontWeight: 400, color: '#888', fontSize: 16 }}>({subjectType?.name || '—'})</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.classroom || '—'}
                      </Typography>
                    </Box>
                  </Box>
                  <Fade in={expandedThis} unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.primary">
                        {s.description || "Описание занятия, преподаватель, тема и т.д."}
                      </Typography>
                    </Box>
                  </Fade>
                </CardContent>
                <CardActions sx={{ pt: 0, pb: 1, pl: 7, justifyContent: 'space-between' }}>
                  {!isCurrent && (
                    <Button size="small" onClick={e => { e.stopPropagation(); setExpanded(expanded === s.id ? null : s.id); }}>
                      {expanded === s.id ? "Свернуть" : "Подробнее"}
                    </Button>
                  )}
                  {mode === "teacher" && expandedThis && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ ml: 'auto' }}
                      onClick={e => {
                        e.stopPropagation();
                        const dateStr = date.toISOString().slice(0, 10);
                        navigate(`/teacher/journal/${s.id}?date=${dateStr}`);
                      }}
                    >
                      Перейти в журнал
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Fade>
          );
        })
      )}
    </Box>
  );
};

export default TodaySchedule;
