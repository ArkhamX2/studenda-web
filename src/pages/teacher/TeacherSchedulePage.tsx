import React, { useEffect, useState } from "react";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography } from "@mui/material";
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
    <>
      <UserHeader title="Расписание" accountPath={accountPath} menuLinks={menuLinks} />
      <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, margin: "0 auto" }}>
        <Typography variant="h5">Расписание</Typography>
        {/* Здесь будет отображение расписания */}
        <pre>{JSON.stringify(subjects, null, 2)}</pre>
      </Box>
    </>
  );
};

export default TeacherSchedulePage;
