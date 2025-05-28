import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourses, setCourses as setCoursesApi } from "../../../../api/common";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Course } from "../../../../types/common";

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course>({ id: 0, name: "", grade: 1 });
  const [errors, setErrors] = useState<{ name?: string; grade?: string }>({});
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getCourses([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCourse(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch course:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const newErrors: { name?: string; grade?: string } = {};
    if (!course.name.trim()) newErrors.name = "Название обязательно";
    if (!course.grade || isNaN(Number(course.grade))) newErrors.grade = "Градация обязательна";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const saveAction = setCoursesApi([course]);
    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} course:`, error);
      });
  };

  const handleChange = (field: keyof Course, value: string | number) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/course");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание курса" : "Редактирование курса"}
      </Typography>
      <TextField
        label="Градация"
        type="number"
        value={course.grade}
        onChange={(e) => handleChange("grade", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
        required
        error={!!errors.grade}
        helperText={errors.grade}
      />
      <TextField
        label="Название"
        value={course.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
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

export default EditCoursePage;
