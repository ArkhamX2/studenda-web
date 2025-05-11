import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroups, setGroups as setGroupsApi, getCourses, getDepartments } from "../../../../api/common";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { Group, Course, Department } from "../../../../types/common";

const EditGroupPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group>({ id: 0, name: "", courseId: 0, departmentId: 0 });
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getGroups([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setGroup(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch group:", error);
        });
    }

    getCourses([])
      .then((response) => setCourses(response.data || []))
      .catch((error) => console.error("Failed to fetch courses:", error));

    getDepartments([])
      .then((response) => setDepartments(response.data || []))
      .catch((error) => console.error("Failed to fetch departments:", error));
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setGroupsApi([group]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} group:`, error);
      });
  };

  const handleChange = (field: keyof Group, value: string) => {
    setGroup((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/group");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание группы" : "Редактирование группы"}
      </Typography>
      <TextField
        select
        label="Курс"
        value={group.courseId || ""}
        onChange={(e) => handleChange("courseId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {courses.map((course) => (
          <MenuItem key={course.id} value={course.id}>
            {course.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Факультет"
        value={group.departmentId || ""}
        onChange={(e) => handleChange("departmentId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {departments.map((department) => (
          <MenuItem key={department.id} value={department.id}>
            {department.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Название"
        value={group.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
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

export default EditGroupPage;
