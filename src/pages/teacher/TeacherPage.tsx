import React from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box } from "@mui/material";

const TeacherPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");

  return (
    <RequireTeacher>
      <UserHeader
        title="Преподаватель"
        accountPath={accountPath}
        menuLinks={menuLinks}
      />
      <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, margin: "0 auto" }}>
        <h1>Welcome, Teacher</h1>
        <p>This is the teacher dashboard.</p>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherPage;
