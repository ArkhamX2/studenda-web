import React from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../components/security/AuthProvider";
import { useParams } from "react-router-dom";
import DaySchedule from "../../components/common/DaySchedule";

const TeacherDayDetailPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { getAccount } = useAuth();
  const account = getAccount();
  const accountId = account?.id || undefined;
  // Получаем из параметров роута
  const { date, weekTypeId, dayPositionId, year } = useParams<{ date?: string; weekTypeId?: string; dayPositionId?: string; year?: string }>();
  const parsedDate = date ? new Date(date) : new Date();
  const academicYear = year ? Number(year) : undefined;

  if (!accountId || !weekTypeId || !dayPositionId || !academicYear) {
    return <Box sx={{ p: 4 }}><UserHeader title="Детальный просмотр дня" accountPath={accountPath} menuLinks={menuLinks} /><Typography color="error">Недостаточно данных для отображения расписания</Typography></Box>;
  }

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Детальный просмотр дня" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 600, margin: "0 auto", pt: 4 }}>
          <DaySchedule
            mode="teacher"
            accountId={accountId}
            academicYear={academicYear}
            weekTypeId={Number(weekTypeId)}
            date={parsedDate}
            dayPositionId={Number(dayPositionId)}
          />
        </Box>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherDayDetailPage;
