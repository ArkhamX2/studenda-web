import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDayPositions, setDayPositions } from "../../../../api/schedule/dayPosition";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditDayPositionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dayPosition, setDayPosition] = useState({ index: 0, name: "" });
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getDayPositions([id])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setDayPosition(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch day position:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = isNew ? setDayPositions([dayPosition]) : setDayPositions([dayPosition]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} day position:`, error);
      });
  };

  const handleChange = (field, value) => {
    setDayPosition((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/day-position");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание позиции учебного дня" : "Редактирование позиции учебного дня"}
      </Typography>
      <TextField
        label="Индекс"
        type="number"
        value={dayPosition.index}
        onChange={(e) => handleChange("index", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Название"
        value={dayPosition.name}
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

export default EditDayPositionPage;
