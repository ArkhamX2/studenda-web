import React from "react";
import RequireStudent from "../../components/security/require/RequireStudent";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box } from "@mui/material";
import FullSchedule from "../../components/common/FullSchedule";
import { useAuth } from "../../components/security/AuthProvider";

const StudentSchedulePage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("student");
  const { getAccount } = useAuth();
  const account = getAccount();
  const groupId = account?.groupId || undefined;

  return (
    <RequireStudent>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Полное расписание" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 1400, margin: "0 auto", pt: 4 }}>
          <FullSchedule mode="student" groupId={groupId} />
        </Box>
      </Box>
    </RequireStudent>
  );
};

export default StudentSchedulePage;
