import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getSubjectByAccount, getSubjectByGroup } from "../../api/schedule/subject";
import { getDisciplines } from "../../api/schedule/discipline";
import { getSubjectPositions } from "../../api/schedule/subject-position";
import { getDayPositions } from "../../api/schedule/dayPosition";
import { getSubjectTypes } from "../../api/schedule/subject-type";
import { getAccounts } from '../../api/security/account';
import { useNavigate } from "react-router-dom";
import ScheduleCardList from "./ScheduleCardList";

interface DayScheduleProps {
  mode: "teacher" | "student";
  accountId?: number;
  groupId?: number;
  academicYear: number;
  weekTypeId: number;
  date: Date;
  dayPositionId: number;
}

const DaySchedule: React.FC<DayScheduleProps> = ({ mode, accountId, groupId, academicYear, weekTypeId, date, dayPositionId }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [related, setRelated] = useState<any>({ disciplines: {}, subjectPositions: {}, dayPositions: {}, subjectTypes: {}, accounts: {} });
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const resp = mode === "teacher"
        ? await getSubjectByAccount(accountId!, weekTypeId, academicYear)
        : await getSubjectByGroup(groupId!, weekTypeId, academicYear);
      const subjects = resp.data || [];
      setSubjects(subjects);
      const disciplineIds = Array.from(new Set(subjects.map((s: any) => s.disciplineId)));
      const subjectPositionIds = Array.from(new Set(subjects.map((s: any) => s.subjectPositionId)));
      const dayPositionIds = Array.from(new Set(subjects.map((s: any) => s.dayPositionId)));
      const subjectTypeIds = Array.from(new Set(subjects.map((s: any) => s.subjectTypeId)));
      const accountIds = mode === 'student' ? Array.from(new Set(subjects.map((s: any) => s.accountId))) : [];
      const [disc, pos, day, type, acc] = await Promise.all([
        getDisciplines(disciplineIds),
        getSubjectPositions(subjectPositionIds),
        getDayPositions(dayPositionIds),
        getSubjectTypes(subjectTypeIds),
        accountIds.length > 0 ? getAccounts(accountIds) : Promise.resolve({ data: [] })
      ]);
      setRelated({
        disciplines: (disc.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
        subjectPositions: (pos.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
        dayPositions: (day.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
        subjectTypes: (type.data || []).reduce((acc: any, d: any) => { acc[d.id] = d; return acc; }, {}),
        accounts: (acc.data || []).reduce((acc: any, a: any) => { acc[a.id] = a; return acc; }, {}),
      });
    };
    fetchData();
  }, [mode, accountId, groupId, academicYear, weekTypeId]);

  // Фильтрация и сортировка
  const sortedSubjects = subjects
    .filter((s: any) => s.dayPositionId === dayPositionId)
    .sort((a: any, b: any) => {
      const posA = related.subjectPositions[a.subjectPositionId];
      const posB = related.subjectPositions[b.subjectPositionId];
      const indexA = posA?.index ?? 0;
      const indexB = posB?.index ?? 0;
      return indexA - indexB;
    });

  if (!weekTypeId || !dayPositionId || !date) {
    return <Typography color="error">Ошибка: не переданы обязательные параметры для расписания дня</Typography>;
  }

  return (
    <ScheduleCardList
      subjects={sortedSubjects}
      related={related}
      expanded={expanded}
      setExpanded={setExpanded}
      mode={mode}
      date={date}
      navigate={navigate}
    />
  );
};

export default DaySchedule;
