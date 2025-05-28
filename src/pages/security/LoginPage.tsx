import React, { useState } from "react";
import { useAuth } from "../../components/security/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { useLoading } from "../../components/LoadingProvider";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, getAccount } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { startLoading, stopLoading } = useLoading();
  const [mustChangePassword, setMustChangePassword] = useState(false);

  if (isAuthenticated() && !mustChangePassword) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    startLoading();
    try {
      const result = await login(email, password);
      if (result.success) {
        // Получаем актуальный аккаунт через getAccount
        const account = getAccount();
        if (account && account.mustChangePassword) {
          setMustChangePassword(true);
          navigate("/change-password");
        } else {
          navigate("/");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      stopLoading();
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Вход
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error === "Login failed" ? "Неверный email или пароль" : "Произошла ошибка"}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
