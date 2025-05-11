import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDisciplines, setDisciplines } from "../../../../api/schedule/discipline";
import { getAccounts } from "../../../../api/security/account";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { Discipline } from "../../../../types/schedule";
import { Account } from "../../../../types/security";

const EditDisciplinePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState<Discipline>({ id: 0, accountId: 0, name: "", description: "" });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      var parsedId = parseInt(id!, 10);
      getDisciplines([parsedId])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setDiscipline(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch discipline:", error);
        });
    }

    getAccounts([])
      .then((response) => setAccounts(response.data || []))
      .catch((error) => console.error("Failed to fetch accounts:", error));
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setDisciplines([discipline]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} discipline:`, error);
      });
  };

  const handleChange = (field: keyof Discipline, value: string) => {
    setDiscipline((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToList = () => {
    navigate("/admin/discipline");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание дисциплины" : "Редактирование дисциплины"}
      </Typography>
      <TextField
        select
        label="Аккаунт"
        value={discipline.accountId}
        onChange={(e) => handleChange("accountId", e.target.value)}
        fullWidth
        margin="normal"
      >
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Название"
        value={discipline.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Описание"
        value={discipline.description}
        onChange={(e) => handleChange("description", e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
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

export default EditDisciplinePage;
