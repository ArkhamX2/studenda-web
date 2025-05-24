import React from "react";
import RequireStudent from "../../components/security/require/RequireStudent";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../components/security/AuthProvider";
import { useParams } from "react-router-dom";
import DaySchedule from "../../components/common/DaySchedule";

const StudentDayDetailPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("student");
  const { getAccount } = useAuth();
  const account = getAccount();
  const groupId = account?.groupId || undefined;
  // Получаем из параметров роута
  const { date, weekTypeId, dayPositionId, year } = useParams<{ date?: string; weekTypeId?: string; dayPositionId?: string; year?: string }>();
  const parsedDate = date ? new Date(date) : new Date();
  const academicYear = year ? Number(year) : undefined;

  // Проверка обязательных параметров
  if (!groupId || !weekTypeId || !dayPositionId || !academicYear) {
    return <Box sx={{ p: 4 }}><UserHeader title="Детальный просмотр дня" accountPath={accountPath} menuLinks={menuLinks} /><Typography color="error">Недостаточно данных для отображения расписания</Typography></Box>;
  }

  return (
    <RequireStudent>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Детальный просмотр дня" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 600, margin: "0 auto", pt: 4 }}>
          <DaySchedule
            mode="student"
            groupId={groupId}
            academicYear={academicYear}
            weekTypeId={Number(weekTypeId)}
            date={parsedDate}
            dayPositionId={Number(dayPositionId)}
          />
        </Box>
      </Box>
    </RequireStudent>
  );
};

export default StudentDayDetailPage;
