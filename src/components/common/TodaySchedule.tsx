import React, { useEffect, useState } from "react";
import { Box, Typography, Fade } from "@mui/material";
import { getSubjectByAccount, getSubjectByGroup } from "../../api/schedule/subject";
import { getDisciplines } from "../../api/schedule/discipline";
import { getSubjectPositions } from "../../api/schedule/subject-position";
import { getDayPositions } from "../../api/schedule/dayPosition";
import { getSubjectTypes } from "../../api/schedule/subject-type";
import { useNavigate } from "react-router-dom";
import { getAccounts } from '../../api/security/account';
import ScheduleCardList from "./ScheduleCardList";

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
        const accountIds = mode === 'student' ? Array.from(new Set(subjects.map((s: any) => s.accountId))) : [];
        Promise.all([
          getDisciplines(disciplineIds),
          getSubjectPositions(subjectPositionIds),
          getDayPositions(dayPositionIds),
          getSubjectTypes(subjectTypeIds),
          accountIds.length > 0 ? getAccounts(accountIds) : Promise.resolve({ data: [] })
        ]).then(([disc, pos, day, type, acc]) => {
          setRelated({
            disciplines: (disc.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            subjectPositions: (pos.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            dayPositions: (day.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            subjectTypes: (type.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
            accounts: (acc.data || []).reduce((acc: any, a: any) => { acc[a.id] = a; return acc; }, {}),
          });
        });
      });
    }
  }, [mode, accountId, groupId, weekTypeId, year]);

  // Определяем текущий день недели и занятия на сегодня
  // Преобразуем: понедельник = 1, ..., воскресенье = 7
  const getWeekday = (date: Date) => {
    const d = date.getDay();
    return d === 0 ? 7 : d;
  };
  const todayDayPositionObj = Object.values(related.dayPositions).find((d: any) => d && typeof d === 'object' && 'index' in d && d.index === getWeekday(date));
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
    <ScheduleCardList
      subjects={sortedTodaySubjects}
      related={related}
      expanded={expanded}
      setExpanded={setExpanded}
      currentId={currentId}
      mode={mode}
      date={date}
      navigate={navigate}
    />
  );
};

export default TodaySchedule;
