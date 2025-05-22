import React from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useAuth } from "../../components/security/AuthProvider";
import { useSettings } from "../../components/SettingsProvider";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import TodaySchedule from "../../components/common/TodaySchedule";

const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  if (hour < 5) return `Доброй ночи, ${name}`;
  if (hour < 12) return `Доброе утро, ${name}`;
  if (hour < 18) return `Добрый день, ${name}`;
  return `Добрый вечер, ${name}`;
};

const TeacherPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { getAccount } = useAuth();
  const account = getAccount();
  const settings = useSettings();

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Сегодня" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 600, margin: "0 auto", pt: 4 }}>
          {/* Greeting Card */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, background: '#fff' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <WbSunnyIcon fontSize="large" sx={{ color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {getGreeting(account?.name || "Преподаватель")}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {settings?.coordinatedUniversalTime ? new Date(settings.coordinatedUniversalTime).toLocaleDateString() : new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
          {/* Lessons List */}
          {account && (
            <TodaySchedule
              mode="teacher"
              accountId={account.id}
              userName={account.name}
              date={settings?.coordinatedUniversalTime ? new Date(settings.coordinatedUniversalTime) : new Date()}
              weekTypeId={settings?.weekTypeId || 1}
              year={settings?.year || new Date().getFullYear()}
            />
          )}
        </Box>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherPage;
