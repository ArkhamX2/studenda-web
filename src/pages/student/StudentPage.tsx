import React, { useEffect, useState } from "react";
import RequireStudent from "../../components/security/require/RequireStudent";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useAuth } from "../../components/security/AuthProvider";
import { getCurrentWeekType } from "../../api/schedule/week-type";
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

const StudentPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("student");
  const { getAccount } = useAuth();
  const account = getAccount();
  const [weekType, setWeekType] = useState<any>(null);
  const settings = useSettings();

  useEffect(() => {
    getCurrentWeekType().then((resp) => {
      setWeekType(resp.data || null);
    });
  }, []);

  return (
    <RequireStudent>
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
                {getGreeting(account?.name || "Студент")}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {settings?.coordinatedUniversalTime ? new Date(settings.coordinatedUniversalTime).toLocaleDateString() : new Date().toLocaleDateString()} {weekType?.name ? `• ${weekType.name} неделя` : ''}
              </Typography>
            </Box>
          </Paper>
          {/* Lessons List */}
          {account?.groupId && weekType && (
            <TodaySchedule
              mode="student"
              groupId={account.groupId}
              userName={account.name}
              weekTypeId={weekType.id}
              date={settings?.coordinatedUniversalTime ? new Date(settings.coordinatedUniversalTime) : new Date()}
              year={settings?.coordinatedUniversalTime ? new Date(settings.coordinatedUniversalTime).getFullYear() : new Date().getFullYear()}
            />
          )}
        </Box>
      </Box>
    </RequireStudent>
  );
};

export default StudentPage;
