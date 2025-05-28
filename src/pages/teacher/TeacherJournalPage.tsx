import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import JournalView from "../../components/common/JournalView";

const TeacherJournalPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { subjectId, date } = useParams<{ subjectId: string, date: string }>();

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Занятие" accountPath={accountPath} menuLinks={menuLinks} />
        <JournalView subjectId={subjectId!} date={date!} mode="teacher" />
      </Box>
    </RequireTeacher>
  );
};

export default TeacherJournalPage;
