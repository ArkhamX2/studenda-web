import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartments, setDepartments as setDepartmentsApi } from "../../../../api/common";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Department } from "../../../../types/common";

const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department>({ id: 0, name: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getDepartments([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setDepartment(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch department:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const newErrors: { name?: string } = {};
    if (!department.name.trim()) newErrors.name = "Название обязательно";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const saveAction = setDepartmentsApi([department]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} department:`, error);
      });
  };

  const handleChange = (field: keyof Department, value: string) => {
    setDepartment((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/department");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание факультета" : "Редактирование факультета"}
      </Typography>
      <TextField
        label="Название"
        value={department.name}
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

export default EditDepartmentPage;
