import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import RequireStudent from "../../components/security/require/RequireStudent";
import JournalView from "../../components/common/JournalView";

const StudentJournalPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("student");
  const { subjectId, date } = useParams<{ subjectId: string, date: string }>();

  return (
    <RequireStudent>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Занятие" accountPath={accountPath} menuLinks={menuLinks} />
        <JournalView subjectId={subjectId!} date={date!} mode="student" />
      </Box>
    </RequireStudent>
  );
};

export default StudentJournalPage;
