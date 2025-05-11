import React, { useState, useEffect } from "react";
import {
  getSubjects,
  getAllSubjectByGroup,
} from "../../../api/schedule/subject";
import {
  getDepartments,
  getGroupsByDepartment,
  getGroups as fetchGroups,
} from "../../../api/common";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getDisciplines } from "../../../api/schedule/discipline";
import { getSubjectPositions } from "../../../api/schedule/subject-position";
import { getDayPositions } from "../../../api/schedule/dayPosition";
import { getWeekTypes } from "../../../api/schedule/week-type";
import { getSubjectTypes } from "../../../api/schedule/subject-type";
import { getAccounts } from "../../../api/security/account";
import { Subject, Discipline, SubjectPosition, DayPosition, WeekType, SubjectType } from "../../../types/schedule";
import { Department, Group } from "../../../types/common";

const SubjectListPage: React.FC = () => {
  const [filterYear, setFilterYear] = useState<number>(2025);
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("");

  const isFilterReady = () => {
    return !!filterDepartment && !!filterGroup && !!filterYear;
  };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [relatedEntities, setRelatedEntities] = useState<{
    disciplines: Record<number, Discipline>;
    subjectPositions: Record<number, SubjectPosition>;
    dayPositions: Record<number, DayPosition>;
    weekTypes: Record<number, WeekType>;
    subjectTypes: Record<number, SubjectType>;
    accounts: Record<number, any>;
    groups: Record<number, Group>;
  }>({
    disciplines: {},
    subjectPositions: {},
    dayPositions: {},
    weekTypes: {},
    subjectTypes: {},
    accounts: {},
    groups: {},
  });

  useEffect(() => {
    getDepartments([]).then((response) => setDepartments(response.data || []));
  }, []);

  useEffect(() => {
    if (filterDepartment) {
      getGroupsByDepartment(parseInt(filterDepartment, 10)).then((response) =>
        setGroups(response.data || [])
      );
    }
  }, [filterDepartment]);

  useEffect(() => {
    if (subjects.length > 0) {
      const fetchRelatedEntities = async () => {
        const disciplineIds = Array.from(new Set(subjects.map((s) => s.disciplineId)));
        const subjectPositionIds = Array.from(new Set(subjects.map((s) => s.subjectPositionId)));
        const dayPositionIds = Array.from(new Set(subjects.map((s) => s.dayPositionId)));
        const weekTypeIds = Array.from(new Set(subjects.map((s) => s.weekTypeId)));
        const subjectTypeIds = Array.from(new Set(subjects.map((s) => s.subjectTypeId)));
        const accountIds = Array.from(new Set(subjects.map((s) => s.accountId)));
        const groupIds = Array.from(new Set(subjects.map((s) => s.groupId)));

        const [disciplines, subjectPositions, dayPositions, weekTypes, subjectTypes, accounts, groups] =
          await Promise.all([
            getDisciplines(disciplineIds),
            getSubjectPositions(subjectPositionIds),
            getDayPositions(dayPositionIds),
            getWeekTypes(weekTypeIds),
            getSubjectTypes(subjectTypeIds),
            getAccounts(accountIds),
            fetchGroups(groupIds),
          ]);

        setRelatedEntities({
          disciplines: (disciplines.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, Discipline>),
          subjectPositions: (subjectPositions.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, SubjectPosition>),
          dayPositions: (dayPositions.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, DayPosition>),
          weekTypes: (weekTypes.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, WeekType>),
          subjectTypes: (subjectTypes.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, SubjectType>),
          accounts: (accounts.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, any>),
          groups: (groups.data || []).reduce((acc, item) => {
            acc[item.id as number] = item;
            return acc;
          }, {} as Record<number, Group>),
        });
      };

      fetchRelatedEntities();
    }
  }, [subjects]);

  const handleFilter = () => {
    if (filterGroup && filterYear) {
      getAllSubjectByGroup(parseInt(filterGroup, 10), filterYear).then((response) =>
        setSubjects(response.data || [])
      );
    }
  };

  const renderSubjects = () => {
    const groupedByWeekType = subjects.reduce((acc, subject) => {
      const weekTypeIndex = relatedEntities.weekTypes[subject.weekTypeId]?.index || 0;
      if (!acc[weekTypeIndex]) acc[weekTypeIndex] = [];
      acc[weekTypeIndex].push(subject);
      return acc;
    }, {} as Record<number, Subject[]>);

    return Object.entries(groupedByWeekType).map(([weekTypeIndex, weekSubjects]) => (
      <Box key={weekTypeIndex} sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Week Type: {relatedEntities.weekTypes[+weekTypeIndex]?.name || weekTypeIndex}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {Object.entries(
            weekSubjects.reduce((acc, subject) => {
              const dayPositionIndex = relatedEntities.dayPositions[subject.dayPositionId]?.index || 0;
              if (!acc[dayPositionIndex]) acc[dayPositionIndex] = [];
              acc[dayPositionIndex].push(subject);
              return acc;
            }, {} as Record<number, Subject[]>)
          ).map(([dayPositionIndex, daySubjects]) => (
            <Box
              key={dayPositionIndex}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 2,
                flex: 1,
                minWidth: 200,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {relatedEntities.dayPositions[+dayPositionIndex]?.name || `Day ${dayPositionIndex}`}
              </Typography>
              {daySubjects.map((subject, idx) => (
                <Box
                  key={subject.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: idx > 0 ? "1px solid #eee" : "none",
                    paddingY: 1,
                  }}
                >
                  <Typography variant="body2">
                    {relatedEntities.subjectPositions[subject.subjectPositionId]?.name ||
                      subject.subjectPositionId}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: "center", flex: 1 }}>
                    {relatedEntities.disciplines[subject.disciplineId]?.name || subject.disciplineId}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {subject.classroom || "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    ));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Занятия
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <TextField
          label="Учебный год"
          type="number"
          value={filterYear}
          onChange={(e) => setFilterYear(+e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Факультет</InputLabel>
          <Select
            value={filterDepartment || ""}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Группа</InputLabel>
          <Select
            value={filterGroup || ""}
            onChange={(e) => setFilterGroup(e.target.value)}
            disabled={groups.length === 0}
          >
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleFilter}
          disabled={!isFilterReady()}
        >
          Применить фильтр
        </Button>
      </Box>
      {renderSubjects()}
    </Box>
  );
};

export default SubjectListPage;
