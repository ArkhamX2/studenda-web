import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccounts, setAccounts } from "../../../../api/security/account";
import { getRoles } from "../../../../api/security/role";
import { getGroups } from "../../../../api/common";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { Account, Role } from "../../../../types/security";
import { Group } from "../../../../types/common";
import { useAuth } from "../../../../components/security/AuthProvider";
import { ApiResult } from "../../../../utils/api";
import { createUser } from "../../../../api/security/common";

const EditAccountPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getAccount } = useAuth();
  const currentUser = getAccount();
  const [account, setAccount] = useState<Account>({
    id: 0,
    surname: "",
    name: "",
    patronymic: "",
    email: "",
    roleId: 0,
    groupId: null,
    identityId: null,
    role: null,
    group: null,
    parentEmail: "",
    mustChangePassword: false,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [password, setPassword] = useState("");
  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      getAccounts([parseInt(id!, 10)])
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setAccount(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch account:", error);
        });
    }

    getRoles([])
      .then((response) => setRoles(response.data || []))
      .catch((error) => console.error("Failed to fetch roles:", error));

    getGroups([])
      .then((response: ApiResult<Group[]>) => setGroups(response.data || []))
      .catch((error: any) => console.error("Failed to fetch groups:", error));
  }, [id, isNew]);

  const handleSave = () => {
    const saveAction = setAccounts([account]);

    saveAction
      .then(() => {
        navigateToList();
      })
      .catch((error) => {
        console.error(`Failed to ${isNew ? "create" : "update"} account:`, error);
      });
  };

  const handleChange = (field: keyof Account, value: string | number | boolean | null) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterUser = async () => {
    try {
      await createUser(account.email, password, account);
      navigateToList();
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  const navigateToList = () => {
    navigate("/admin/user");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Регистрация аккаунта" : "Редактирование аккаунта"}
      </Typography>
      <TextField
        label="Фамилия"
        value={account.surname}
        onChange={(e) => handleChange("surname", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Имя"
        value={account.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Отчество"
        value={account.patronymic || ""}
        onChange={(e) => handleChange("patronymic", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={account.email}
        onChange={(e) => handleChange("email", e.target.value)}
        fullWidth
        margin="normal"
      />
      {isNew && (
        <TextField
          label="Пароль для пользователя"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}
      <TextField
        label="Email родителя"
        value={account.parentEmail || ""}
        onChange={(e) => handleChange("parentEmail", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Роль"
        value={account.roleId || ""}
        onChange={(e) => handleChange("roleId", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
        disabled={currentUser?.id === account.id} // Disable if editing current user
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Группа"
        value={account.groupId || ""}
        onChange={(e) => handleChange("groupId", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      >
        {groups.map((group: Group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            id="mustChangePassword"
            checked={!!account.mustChangePassword}
            onChange={(e) => handleChange("mustChangePassword", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          <label htmlFor="mustChangePassword">Требовать смену пароля при входе</label>
        </Box>
        <Box>
          {!isNew && (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Сохранить
            </Button>
          )}
          {isNew && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRegisterUser}
              sx={{ ml: 2 }}
              disabled={!account.email || !password}
            >
              Сохранить
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={() => navigateToList()} sx={{ ml: 2 }}>
            Назад
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditAccountPage;
