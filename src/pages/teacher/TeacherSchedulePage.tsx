import React, { useEffect, useState } from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography } from "@mui/material";
import FullSchedule from "../../components/common/FullSchedule";
import { getAllSubjectByAccount } from "../../api/schedule/subject";
import { useAuth } from "../../components/security/AuthProvider";

const TeacherSchedulePage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { getAccount } = useAuth();
  const account = getAccount();
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    if (account) {
      getAllSubjectByAccount(account.id, new Date().getFullYear()).then((resp) => {
        setSubjects(resp.data || []);
      });
    }
  }, [account]);

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Полное расписание" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 1400, margin: "0 auto", pt: 4 }}>
          <FullSchedule />
        </Box>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherSchedulePage;
