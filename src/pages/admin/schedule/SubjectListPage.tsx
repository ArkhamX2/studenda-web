import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  getSubjects,
  getAllSubjectByGroup,
  getSubjectByGroup,
  deleteSubjects,
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
  IconButton,
} from "@mui/material";
import { getDisciplines } from "../../../api/schedule/discipline";
import { getSubjectPositions } from "../../../api/schedule/subject-position";
import { getDayPositions } from "../../../api/schedule/dayPosition";
import { getWeekTypes } from "../../../api/schedule/week-type";
import { getSubjectTypes } from "../../../api/schedule/subject-type";
import { getAccounts } from "../../../api/security/account";
import { Subject, Discipline, SubjectPosition, DayPosition, WeekType, SubjectType } from "../../../types/schedule";
import { Department, Group } from "../../../types/common";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditSubjectPage from './edit/EditSubjectPage';

const SubjectListPage: React.FC = () => {
  const [filterYear, setFilterYear] = useState<number>(2025);
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("");
  const [filterWeekType, setFilterWeekType] = useState<string>("");

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

  const [weekTypes, setWeekTypes] = useState<WeekType[]>([]);
  const [allDayPositions, setAllDayPositions] = useState<DayPosition[]>([]);
  const [allSubjectPositions, setAllSubjectPositions] = useState<SubjectPosition[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getDepartments([]).then((response) => setDepartments(response.data || []));
    getWeekTypes([]).then((response) => {
      const weekTypesArr = response.data || [];
      setWeekTypes(weekTypesArr);
      setRelatedEntities((prev) => ({
        ...prev,
        weekTypes: weekTypesArr.reduce((acc, item) => {
          acc[item.id as number] = item;
          return acc;
        }, {} as Record<number, WeekType>),
      }));
    });
    // Получаем все dayPositions и subjectPositions без фильтрации и сохраняем отдельно
    getDayPositions([]).then((response) => {
      const arr = response.data || [];
      setAllDayPositions(arr);
      setRelatedEntities((prev) => ({
        ...prev,
        dayPositions: arr.reduce((acc, item) => {
          acc[item.id as number] = item;
          return acc;
        }, {} as Record<number, DayPosition>),
      }));
    });
    getSubjectPositions([]).then((response) => {
      const arr = response.data || [];
      setAllSubjectPositions(arr);
      setRelatedEntities((prev) => ({
        ...prev,
        subjectPositions: arr.reduce((acc, item) => {
          acc[item.id as number] = item;
          return acc;
        }, {} as Record<number, SubjectPosition>),
      }));
    });
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

  useEffect(() => {
    // Если пришли со страницы редактирования с фильтром — применяем его и фильтруем
    if (location.state && (location.state.filterYear || location.state.filterDepartment || location.state.filterGroup || location.state.filterWeekType)) {
      if (location.state.filterYear) setFilterYear(location.state.filterYear);
      if (location.state.filterDepartment) setFilterDepartment(location.state.filterDepartment);
      if (location.state.filterGroup) setFilterGroup(location.state.filterGroup);
      if (location.state.filterWeekType) setFilterWeekType(location.state.filterWeekType);
    }
  }, []);

  useEffect(() => {
    // Автоматически применяем фильтр, если все значения фильтра заполнены (например, после возврата)
    if (filterYear && filterGroup && filterDepartment) {
      handleFilter();
    }
  }, [filterYear, filterGroup, filterDepartment, filterWeekType]);

  const handleFilter = () => {
    if (filterGroup && filterYear) {
      if (filterWeekType) {
        getSubjectByGroup(parseInt(filterGroup, 10), parseInt(filterWeekType, 10), filterYear).then((response) => {
          setSubjects(response.data || []);
        });
      } else {
        getAllSubjectByGroup(parseInt(filterGroup, 10), filterYear).then((response) => {
          setSubjects(response.data || []);
        });
      }
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    await deleteSubjects([subjectId]);
    // После удаления обновляем список занятий
    handleFilter();
  };

  const renderSubjects = () => {
    const dayPositions = allDayPositions.sort((a, b) => a.index - b.index);
    const subjectPositions = allSubjectPositions.sort((a, b) => a.index - b.index);

    // Мапа для быстрого поиска занятия по dayPositionId и subjectPositionId
    const subjectMap = new Map();
    subjects.forEach((subject) => {
      subjectMap.set(`${subject.dayPositionId}_${subject.subjectPositionId}`, subject);
    });

    return (
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {dayPositions.map((day) => (
            <Box
              key={day.id}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 2,
                minWidth: 200,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {day.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {subjectPositions.map((subjectPos) => {
                  const subject = subjectMap.get(`${day.id}_${subjectPos.id}`);
                  const subjectType = relatedEntities.subjectTypes[subject?.subjectTypeId];
                  const discipline = relatedEntities.disciplines[subject?.disciplineId];
                  const subjectTypeName = subjectType ? subjectType.name : '-';
                  const disciplineName = discipline ? discipline.name : '-';

                  return (
                    <Box
                      key={subjectPos.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr 80px 64px",
                        alignItems: "center",
                        borderTop: "1px solid #eee",
                        paddingY: 1,
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 100 }}>
                        {subjectPos.startLabel} - {subjectPos.endLabel}
                      </Typography>
                      <Typography variant="body1" sx={{ textAlign: "center", minWidth: 120 }}>
                        {subject ? disciplineName + ' (' + subjectTypeName + ')' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: "right", minWidth: 60 }}>
                        {subject ? (subject.classroom || '-') : ''}
                      </Typography>
                      {subject ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton size="small" color="primary" aria-label="edit" onClick={() => navigate(`/admin/schedule/subject/edit/${subject.id}`, { state: { filterYear, filterDepartment, filterGroup, filterWeekType, dayPositionId: day.id, subjectPositionId: subjectPos.id } })}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" aria-label="delete" onClick={() => handleDeleteSubject(subject.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton size="small" color="primary" aria-label="add" onClick={() => navigate(`/admin/schedule/subject/edit`, { state: { filterYear, filterDepartment, filterGroup, filterWeekType, dayPositionId: day.id, subjectPositionId: subjectPos.id } })}>
                            <AddCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
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
          <InputLabel>Тип недели</InputLabel>
          <Select
            value={filterWeekType || ""}
            onChange={(e) => setFilterWeekType(e.target.value)}
            displayEmpty
          >
            {weekTypes.map((weekType) => (
              <MenuItem key={weekType.id} value={weekType.id}>
                {weekType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
