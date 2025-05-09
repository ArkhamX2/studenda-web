import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/security/AuthProvider";
import { SettingsProvider } from "./components/SettingsProvider";
import LoginPage from "./pages/security/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import TeacherPage from "./pages/teacher/TeacherPage";
import StudentPage from "./pages/student/StudentPage";

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/student" element={<StudentPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
