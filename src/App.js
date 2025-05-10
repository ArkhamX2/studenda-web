import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/security/AuthProvider";
import { SettingsProvider } from "./components/SettingsProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/security/LoginPage";
import TeacherPage from "./pages/teacher/TeacherPage";
import StudentPage from "./pages/student/StudentPage";
import UserListPage from "./pages/admin/UserListPage";
import CourseListPage from "./pages/admin/CourseListPage";
import GroupListPage from "./pages/admin/GroupListPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DepartmentListPage from "./pages/admin/DepartmentListPage";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="user" element={<UserListPage />} />
                <Route path="course" element={<CourseListPage />} />
                <Route path="group" element={<GroupListPage />} />
                <Route path="department" element={<DepartmentListPage />} />
              </Route>
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/student" element={<StudentPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
