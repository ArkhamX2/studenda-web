import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSubjects as getSubjectsApi, setSubjects as setSubjectsApi } from "../../../../api/schedule/subject";
import { getGroups as getGroupsApi, getGroups } from "../../../../api/common";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { Group } from "../../../../types/common";
import { Subject } from "../../../../types/schedule";
import { getDisciplines } from "../../../../api/schedule/discipline";
import { getSubjectPositions } from "../../../../api/schedule/subject-position";
import { getDayPositions } from "../../../../api/schedule/dayPosition";
import { getWeekTypes } from "../../../../api/schedule/week-type";
import { getSubjectTypes } from "../../../../api/schedule/subject-type";
import { getAccounts } from "../../../../api/security/account";
import { Discipline, SubjectPosition, DayPosition, WeekType, SubjectType } from "../../../../types/schedule";
import { Account } from "../../../../types/security";

const EditSubjectPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [subject, setSubject] = useState<Subject>({ id: 0, disciplineId: 0, subjectPositionId: 0, dayPositionId: 0, weekTypeId: 0, subjectTypeId: 0, accountId: 0, groupId: 0, academicYear: 0, classroom: "", description: "" });
  const [groups, setGroups] = useState<Group[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [subjectPositions, setSubjectPositions] = useState<SubjectPosition[]>([]);
  const [dayPositions, setDayPositions] = useState<DayPosition[]>([]);
  const [weekTypes, setWeekTypes] = useState<WeekType[]>([]);
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getSubjectsApi([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setSubject(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch subject:", error);
        });
    }

    getGroupsApi([])
      .then((response) => setGroups(response.data || []))
      .catch((error) => console.error("Failed to fetch groups:", error));

    getDisciplines([]).then((response) => setDisciplines(response.data || []));
    getSubjectPositions([]).then((response) => setSubjectPositions(response.data || []));
    getDayPositions([]).then((response) => setDayPositions(response.data || []));
    getWeekTypes([]).then((response) => setWeekTypes(response.data || []));
    getSubjectTypes([]).then((response) => setSubjectTypes(response.data || []));
    getAccounts([]).then((response) => setAccounts(response.data || []));
  }, [id, isNew]);

  // Получаем фильтр и позиции из location.state, если есть
  useEffect(() => {
    if (location.state) {
      const patch: Partial<Subject> = {};
      if (location.state.filterYear) patch.academicYear = location.state.filterYear;
      if (location.state.filterGroup) patch.groupId = +location.state.filterGroup;
      if (location.state.filterWeekType) patch.weekTypeId = +location.state.filterWeekType;
      if (location.state.dayPositionId) patch.dayPositionId = +location.state.dayPositionId;
      if (location.state.subjectPositionId) patch.subjectPositionId = +location.state.subjectPositionId;
      // departmentId не входит в Subject, но можно сохранить для передачи обратно
      setSubject((prev) => ({ ...prev, ...patch }));
    }
  }, []);

  const setFilter = (patch: any) => {
    setSubject((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const saveAction = setSubjectsApi([subject]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} subject:`, error);
      });
  };

  const handleChange = (field: keyof Subject, value: string) => {
    setSubject((prev) => ({ ...prev, [field]: value }));
  };

  // В navigateToList передаем все параметры обратно
  const navigateToList = async () => {
    let filterDepartment = undefined;
    if (subject.groupId) {
      // Получаем группу и определяем departmentId
      try {
        const response = await getGroups([subject.groupId]);
        if (response.data && response.data.length > 0) {
          filterDepartment = response.data[0].departmentId;
        }
      } catch (e) {
        // ignore
      }
    }
    navigate("/admin/subject", { state: {
      filterYear: subject.academicYear,
      filterGroup: subject.groupId,
      filterWeekType: subject.weekTypeId,
      filterDepartment,
      dayPositionId: subject.dayPositionId,
      subjectPositionId: subject.subjectPositionId
    }});
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание занятия" : "Редактирование занятия"}
      </Typography>
      <TextField
        label="Учебный год"
        type="number"
        value={subject.academicYear || ""}
        onChange={(e) => handleChange("academicYear", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Тип недели"
        value={subject.weekTypeId || ""}
        onChange={(e) => handleChange("weekTypeId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {weekTypes.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Группа"
        value={subject.groupId || ""}
        onChange={(e) => handleChange("groupId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {groups.map((group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="День недели"
        value={subject.dayPositionId || ""}
        onChange={(e) => handleChange("dayPositionId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {dayPositions.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Позиция занятия"
        value={subject.subjectPositionId || ""}
        onChange={(e) => handleChange("subjectPositionId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {subjectPositions.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Дисциплина"
        value={subject.disciplineId || ""}
        onChange={(e) => handleChange("disciplineId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {disciplines.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Тип занятия"
        value={subject.subjectTypeId || ""}
        onChange={(e) => handleChange("subjectTypeId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {subjectTypes.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Преподаватель"
        value={subject.accountId || ""}
        onChange={(e) => handleChange("accountId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {accounts.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.surname} {item.name} {item.patronymic}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Кабинет"
        value={subject.classroom}
        onChange={(e) => handleChange("classroom", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Описание"
        value={subject.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        fullWidth
        margin="normal"
        multiline
        minRows={2}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Сохранить
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigateToList()}>
          Назад
        </Button>
      </Box>
    </Box>
  );
};

export default EditSubjectPage;
