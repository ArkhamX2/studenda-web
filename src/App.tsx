import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "./components/security/AuthProvider";
import { SettingsProvider } from "./components/SettingsProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/security/LoginPage";
import TeacherPage from "./pages/teacher/TeacherPage";
import StudentPage from "./pages/student/StudentPage";
import AccountListPage from "./pages/admin/security/AccountListPage";
import AdminAccountListPage from "./pages/admin/security/AdminAccountListPage";
import TeacherAccountListPage from "./pages/admin/security/TeacherAccountListPage";
import StudentAccountListPage from "./pages/admin/security/StudentAccountListPage";
import CourseListPage from "./pages/admin/common/CourseListPage";
import GroupListPage from "./pages/admin/common/GroupListPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DepartmentListPage from "./pages/admin/common/DepartmentListPage";
import EditCoursePage from "./pages/admin/common/edit/EditCoursePage";
import EditDepartmentPage from "./pages/admin/common/edit/EditDepartmentPage";
import EditGroupPage from "./pages/admin/common/edit/EditGroupPage";
import DisciplineListPage from "./pages/admin/schedule/DisciplineListPage";
import SubjectPositionListPage from "./pages/admin/schedule/SubjectPositionListPage";
import WeekTypeListPage from "./pages/admin/schedule/WeekTypeListPage";
import SubjectTypeListPage from "./pages/admin/schedule/SubjectTypeListPage";
import DayPositionListPage from "./pages/admin/schedule/DayPositionListPage";
import EditDayPositionPage from "./pages/admin/schedule/edit/EditDayPositionPage";
import EditDisciplinePage from "./pages/admin/schedule/edit/EditDisciplinePage";
import EditSubjectTypePage from "./pages/admin/schedule/edit/EditSubjectTypePage";
import EditWeekTypePage from "./pages/admin/schedule/edit/EditWeekTypePage";
import EditSubjectPositionPage from "./pages/admin/schedule/edit/EditSubjectPositionPage";
import SubjectListPage from "./pages/admin/schedule/SubjectListPage";
import EditAccountPage from "./pages/admin/security/edit/EditAccountPage";
import EditSubjectPage from './pages/admin/schedule/edit/EditSubjectPage';
import ChangePasswordPage from "./pages/security/ChangePasswordPage";
import RoleListPage from "./pages/admin/security/RoleListPage";
import EditRolePage from "./pages/admin/security/edit/EditRolePage";
import StudentAccountPage from "./pages/student/StudentAccountPage";
import TeacherAccountPage from "./pages/teacher/TeacherAccountPage";

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

const App: React.FC = () => {
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
                <Route path="user" element={<AccountListPage />} />
                <Route path="user/edit" element={<EditAccountPage />} />
                <Route path="user/edit/:id" element={<EditAccountPage />} />
                <Route path="course" element={<CourseListPage />} />
                <Route path="course/edit" element={<EditCoursePage />} />
                <Route path="course/edit/:id" element={<EditCoursePage />} />
                <Route path="group" element={<GroupListPage />} />
                <Route path="group/edit" element={<EditGroupPage />} />
                <Route path="group/edit/:id" element={<EditGroupPage />} />
                <Route path="department" element={<DepartmentListPage />} />
                <Route path="department/edit" element={<EditDepartmentPage />} />
                <Route path="department/edit/:id" element={<EditDepartmentPage />} />
                <Route path="discipline" element={<DisciplineListPage />} />
                <Route path="discipline/edit" element={<EditDisciplinePage />} />
                <Route path="discipline/edit/:id" element={<EditDisciplinePage />} />
                <Route path="subject-position" element={<SubjectPositionListPage />} />
                <Route path="subject-position/edit" element={<EditSubjectPositionPage />} />
                <Route path="subject-position/edit/:id" element={<EditSubjectPositionPage />} />
                <Route path="week-type" element={<WeekTypeListPage />} />
                <Route path="week-type/edit" element={<EditWeekTypePage />} />
                <Route path="week-type/edit/:id" element={<EditWeekTypePage />} />
                <Route path="subject-type" element={<SubjectTypeListPage />} />
                <Route path="subject-type/edit" element={<EditSubjectTypePage />} />
                <Route path="subject-type/edit/:id" element={<EditSubjectTypePage />} />
                <Route path="day-position" element={<DayPositionListPage />} />
                <Route path="day-position/edit" element={<EditDayPositionPage />} />
                <Route path="day-position/edit/:id" element={<EditDayPositionPage />} />
                <Route path="subject" element={<SubjectListPage />} />
                <Route path="admin-accounts" element={<AdminAccountListPage />} />
                <Route path="teacher-accounts" element={<TeacherAccountListPage />} />
                <Route path="student-accounts" element={<StudentAccountListPage />} />
                <Route path="schedule/subject/edit" element={<EditSubjectPage />} />
                <Route path="schedule/subject/edit/:id" element={<EditSubjectPage />} />
                <Route path="role" element={<RoleListPage />} />
                <Route path="role/edit" element={<EditRolePage />} />
                <Route path="role/edit/:id" element={<EditRolePage />} />
              </Route>
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/student" element={<StudentPage />} />
              <Route path="/student/account" element={<StudentAccountPage />} />
              <Route path="/teacher/account" element={<TeacherAccountPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
