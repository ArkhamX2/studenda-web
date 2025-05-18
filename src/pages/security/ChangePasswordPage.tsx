import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/security/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { changePassword } from "../../api/security/common";

const ChangePasswordPage: React.FC = () => {
  const authContext = useContext(AuthContext) as {
    getAccount: () => any;
    logout: () => void;
    isAuthenticated: () => boolean;
    setAuthData: (data: any) => void;
  };
  const { getAccount, logout, isAuthenticated, setAuthData } = authContext;
  const account = getAccount();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!account) {
    logout();
    navigate("/login");
    return null;
  }

  // Если пользователь уже сменил пароль, не даём доступ к этой странице
  if (isAuthenticated() && !account.mustChangePassword) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      // Используем новую ручку смены пароля
      const response = await changePassword(password);
      if (response.success && response.data) {
        setAuthData({ account: response.data.account, token: response.data.token });
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.log(response);
        setError("Ошибка при смене пароля");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при смене пароля");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Смена пароля
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Новый пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Повторите пароль"
          type="password"
          fullWidth
          margin="normal"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">Пароль успешно изменён</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Сменить пароль
        </Button>
      </form>
    </Box>
  );
};

export default ChangePasswordPage;
