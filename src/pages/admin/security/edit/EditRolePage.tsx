import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoles, setRoles } from "../../../../api/security/role";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { Role } from "../../../../types/security";
import { useSettings } from "../../../../components/SettingsProvider";

const EditRolePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [role, setRole] = useState<Role>({
    id: 0,
    name: "",
    permission: "",
    tokenLifetimeSeconds: 86400,
    canRegister: false,
    accounts: [],
  });

  const settings = useSettings();
  const permissionOptions = [
    settings?.adminPermission,
    settings?.teacherPermission,
    settings?.defaultPermission,
    settings?.leaderPermission,
  ].filter(Boolean);

  useEffect(() => {
    if (!isNew) {
      getRoles([parseInt(id!, 10)]).then((response) => {
        if (response.data && response.data.length > 0) {
          setRole(response.data[0]);
        }
      });
    }
  }, [id, isNew]);

  const handleChange = (field: keyof Role, value: any) => {
    setRole((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setRoles([role]).then(() => navigateToList());
  };

  const navigateToList = () => {
    navigate("/admin/role");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Создание роли" : "Редактирование роли"}
      </Typography>
      <TextField
        label="Название"
        value={role.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Permission (строка разрешения)"
        value={role.permission}
        onChange={(e) => handleChange("permission", e.target.value)}
        fullWidth
        margin="normal"
      >
        {permissionOptions.map((perm) => (
          <MenuItem key={perm} value={perm}>
            {perm}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Время жизни токена (сек)"
        type="number"
        value={role.tokenLifetimeSeconds}
        onChange={(e) => handleChange("tokenLifetimeSeconds", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <input
          type="checkbox"
          id="canRegister"
          checked={!!role.canRegister}
          onChange={(e) => handleChange("canRegister", e.target.checked)}
          style={{ marginRight: 8 }}
        />
        <label htmlFor="canRegister">Может регистрироваться самостоятельно</label>
      </Box>
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

export default EditRolePage;
