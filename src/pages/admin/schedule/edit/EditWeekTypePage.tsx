import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWeekTypes, setWeekTypes } from "../../../../api/schedule/week-type";
import { TextField, Button, Box, Typography } from "@mui/material";
import { WeekType } from "../../../../types/schedule";

const EditWeekTypePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
    const [weekType, setWeekTypeState] = useState<WeekType>({ id: 0, index: 1, name: "" });
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      var parsedId = parseInt(id!, 10);
      getWeekTypes([parsedId])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setWeekTypeState(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch week type:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setWeekTypes([weekType]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} week type:`, error);
      });
  };

  const handleChange = (field: keyof WeekType, value: string | number) => {
    setWeekTypeState((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/week-type");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание типа недели" : "Редактирование типа недели"}
      </Typography>
      <TextField
        label="Индекс"
        type="number"
        value={weekType.index}
        onChange={(e) => handleChange("index", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Название"
        value={weekType.name}
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

export default EditWeekTypePage;
