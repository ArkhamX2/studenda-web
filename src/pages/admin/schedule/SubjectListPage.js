import React, { useState, useEffect } from "react";
import { getSubjects, getAllSubjectByGroup } from "../../../api/schedule/subject";
import { getDepartments, getGroupsByDepartment } from "../../../api/common";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { getDisciplines } from "../../../api/schedule/discipline";
import { getSubjectPositions } from "../../../api/schedule/subject-position";
import { getDayPositions } from "../../../api/schedule/dayPosition";
import { getWeekTypes } from "../../../api/schedule/week-type";
import { getSubjectTypes } from "../../../api/schedule/subject-type";
import { getAccounts } from "../../../api/security/account";
import { getGroups } from "../../../api/common";

const SubjectListPage = () => {
  const [filterYear, setFilterYear] = useState(2025);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const isFilterReady = () => {
    return filterDepartment && filterGroup && filterYear;
  };

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState({
    disciplines: {},
    subjectPositions: {},
    dayPositions: {},
    weekTypes: {},
    subjectTypes: {},
    accounts: {},
    groups: {},
  });

  useEffect(() => {
    getDepartments([]).then((response) => setDepartments(response.data));
  }, []);

  useEffect(() => {
    if (filterDepartment) {
      getGroupsByDepartment([filterDepartment]).then((response) => setGroups(response.data));
    }
  }, [filterDepartment]);

  useEffect(() => {
    if (subjects.length > 0) {
      const fetchRelatedEntities = async () => {
        const disciplineIds = [...new Set(subjects.map((s) => s.disciplineId))];
        const subjectPositionIds = [...new Set(subjects.map((s) => s.subjectPositionId))];
        const dayPositionIds = [...new Set(subjects.map((s) => s.dayPositionId))];
        const weekTypeIds = [...new Set(subjects.map((s) => s.weekTypeId))];
        const subjectTypeIds = [...new Set(subjects.map((s) => s.subjectTypeId))];
        const accountIds = [...new Set(subjects.map((s) => s.accountId))];
        const groupIds = [...new Set(subjects.map((s) => s.groupId))];

        const [disciplines, subjectPositions, dayPositions, weekTypes, subjectTypes, accounts, groups] = await Promise.all([
          getDisciplines(disciplineIds),
          getSubjectPositions(subjectPositionIds),
          getDayPositions(dayPositionIds),
          getWeekTypes(weekTypeIds),
          getSubjectTypes(subjectTypeIds),
          getAccounts(accountIds),
          getGroups(groupIds),
        ]);

        setRelatedEntities({
          disciplines: disciplines.data,
          subjectPositions: subjectPositions.data,
          dayPositions: dayPositions.data,
          weekTypes: weekTypes.data,
          subjectTypes: subjectTypes.data,
          accounts: accounts.data,
          groups: groups.data,
        });
      };

      fetchRelatedEntities();
    }
  }, [subjects]);

  const handleFilter = () => {
    if (filterGroup && filterYear) {
      getAllSubjectByGroup(filterGroup, filterYear).then((response) => setSubjects(response.data));
    }
  };

  const renderSubjects = () => {
    const groupedByWeekType = subjects.reduce((acc, subject) => {
      const weekTypeIndex = relatedEntities.weekTypes[subject.weekTypeId]?.index || 0;
      if (!acc[weekTypeIndex]) acc[weekTypeIndex] = [];
      acc[weekTypeIndex].push(subject);
      return acc;
    }, {});

    return Object.entries(groupedByWeekType).map(([weekTypeIndex, weekSubjects]) => (
      <Box key={weekTypeIndex} sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Week Type: {relatedEntities.weekTypes[weekTypeIndex]?.name || weekTypeIndex}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {Object.entries(
            weekSubjects.reduce((acc, subject) => {
              const dayPositionIndex = relatedEntities.dayPositions[subject.dayPositionId]?.index || 0;
              if (!acc[dayPositionIndex]) acc[dayPositionIndex] = [];
              acc[dayPositionIndex].push(subject);
              return acc;
            }, {})
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
                {relatedEntities.dayPositions[dayPositionIndex]?.name || `Day ${dayPositionIndex}`}
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
                    {relatedEntities.subjectPositions[subject.subjectPositionId]?.name || subject.subjectPositionId}
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
          onChange={(e) => setFilterYear(e.target.value)}
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
        <Button variant="contained" onClick={handleFilter} disabled={!isFilterReady()}>
          Применить фильтр
        </Button>
      </Box>
      {renderSubjects()}
    </Box>
  );
};

export default SubjectListPage;
