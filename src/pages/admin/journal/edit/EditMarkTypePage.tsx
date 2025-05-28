import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMarkTypes, setMarkTypes as setMarkTypesApi } from "../../../../api/journal/markType";
import { TextField, Button, Box, Typography } from "@mui/material";
import { MarkType } from "../../../../types/journal";

const EditMarkTypePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [markType, setMarkType] = useState<MarkType>({ id: 0, name: "", minValue: 0, maxValue: 0 });
  const [errors, setErrors] = useState<{ name?: string; minValue?: string; maxValue?: string }>({});
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getMarkTypes([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setMarkType(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch mark type:", error);
        });
    }
  }, [id, isNew]);

  const handleSave = () => {
    const newErrors: { name?: string; minValue?: string; maxValue?: string } = {};
    if (!markType.name.trim()) newErrors.name = "Название обязательно";
    if (markType.minValue < 0) newErrors.minValue = "Минимальное значение не может быть меньше 0";
    if (markType.maxValue <= markType.minValue) newErrors.maxValue = "Максимальное значение должно быть больше минимального";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setMarkTypesApi([markType])
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} mark type:`, error);
      });
  };

  const handleChange = (field: keyof MarkType, value: any) => {
    setMarkType((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/journal/mark-type");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание типа оценивания" : "Редактирование типа оценивания"}
      </Typography>
      <TextField
        label="Название"
        value={markType.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Минимальное значение"
        type="number"
        value={markType.minValue}
        onChange={e => handleChange("minValue", Number(e.target.value))}
        fullWidth
        margin="normal"
        error={!!errors.minValue}
        helperText={errors.minValue}
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Максимальное значение"
        type="number"
        value={markType.maxValue}
        onChange={e => handleChange("maxValue", Number(e.target.value))}
        fullWidth
        margin="normal"
        error={!!errors.maxValue}
        helperText={errors.maxValue}
        inputProps={{ min: 0 }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Сохранить
        </Button>
        <Button variant="outlined" color="secondary" onClick={navigateToList}>
          Назад
        </Button>
      </Box>
    </Box>
  );
};

export default EditMarkTypePage;
