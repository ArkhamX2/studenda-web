import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectTypes, setSubjectTypes } from "../../../../api/schedule/subject-type";
import { TextField, Button, Box, Typography } from "@mui/material";
import { SubjectType } from "../../../../types/schedule";

const EditSubjectTypePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [subjectType, setSubjectType] = useState<SubjectType>({ id: 0, name: "" });
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      var parsedId = parseInt(id!, 10);
      getSubjectTypes([parsedId])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setSubjectType(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch subject type:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setSubjectTypes([subjectType]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} subject type:`, error);
      });
  };

  const handleChange = (field: keyof SubjectType, value: string) => {
    setSubjectType((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/subject-type");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание типа учебного предмета" : "Редактирование типа учебного предмета"}
      </Typography>
      <TextField
        label="Название"
        value={subjectType.name}
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

export default EditSubjectTypePage;
