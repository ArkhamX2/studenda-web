import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourses, setCourses as setCoursesApi } from "../../../../api/common";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({ grade: 1, name: "" });
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getCourses([id])
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
    const saveAction = isNew ? setCoursesApi([course]) : setCoursesApi([course]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} course:`, error);
      });
  };

  const handleChange = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/course");
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Редактирование
      </Typography>
      <TextField
        label="Градация"
        value={course.grade}
        onChange={(e) => handleChange("grade", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Название"
        value={course.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Сохранить
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigateToList()}>Назад</Button>
      </Box>
    </Box>
  );
};

export default EditCoursePage;
