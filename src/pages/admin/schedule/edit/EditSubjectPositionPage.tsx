import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectPositions, setSubjectPositions } from "../../../../api/schedule/subject-position";
import { TextField, Button, Box, Typography } from "@mui/material";
import { SubjectPosition } from "../../../../types/schedule";

const EditSubjectPositionPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [subjectPosition, setSubjectPositionState] = useState<SubjectPosition>({
    id: 0,
    index: 1,
    startLabel: "",
    endLabel: "",
    name: "",
  });
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      var parsedId = parseInt(id!, 10);
      getSubjectPositions([parsedId])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setSubjectPositionState(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch subject position:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setSubjectPositions([subjectPosition]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} subject position:`, error);
      });
  };

  const handleChange = (field: keyof SubjectPosition, value: string | number) => {
    setSubjectPositionState((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/subject-position");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание позиции предмета" : "Редактирование позиции предмета"}
      </Typography>
      <TextField
        label="Индекс"
        type="number"
        value={subjectPosition.index}
        onChange={(e) => {
          const val = Math.max(1, parseInt(e.target.value, 10) || 1);
          handleChange("index", val);
        }}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />
      <TextField
        label="Начальная метка"
        value={subjectPosition.startLabel}
        onChange={(e) => handleChange("startLabel", e.target.value)}
        fullWidth
        margin="normal"
        placeholder="8:30"
        inputProps={{ pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" }}
        error={!!subjectPosition.startLabel && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(subjectPosition.startLabel)}
        helperText={subjectPosition.startLabel && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(subjectPosition.startLabel) ? "Введите время в формате ЧЧ:ММ" : ""}
      />
      <TextField
        label="Конечная метка"
        value={subjectPosition.endLabel}
        onChange={(e) => handleChange("endLabel", e.target.value)}
        fullWidth
        margin="normal"
        placeholder="10:15"
        inputProps={{ pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" }}
        error={!!subjectPosition.endLabel && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(subjectPosition.endLabel)}
        helperText={subjectPosition.endLabel && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(subjectPosition.endLabel) ? "Введите время в формате ЧЧ:ММ" : ""}
      />
      <TextField
        label="Название"
        value={subjectPosition.name}
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

export default EditSubjectPositionPage;
