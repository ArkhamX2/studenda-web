import React from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box } from "@mui/material";
import FullSchedule from "../../components/common/FullSchedule";
import { useAuth } from "../../components/security/AuthProvider";

const TeacherSchedulePage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { getAccount } = useAuth();
  const account = getAccount();

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Полное расписание" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 1400, margin: "0 auto", pt: 4 }}>
          <FullSchedule mode="teacher" accountId={account?.id} />
        </Box>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherSchedulePage;
