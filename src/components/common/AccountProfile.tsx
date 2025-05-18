import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useAuth } from "../../components/security/AuthProvider";
import { Link } from "react-router-dom";
import { getGroups, getCourses, getDepartments } from "../../api/common";
import { Group, Course, Department } from "../../types/common";
import { useNavigate } from "react-router-dom";

const AccountProfile: React.FC = () => {
  const navigate = useNavigate();
  const { getAccount, setAuthData } = useAuth();
  const account = getAccount();
  const [group, setGroup] = useState<Group | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (account?.groupId) {
        const groupResp = await getGroups([account.groupId]);
        const groupData = groupResp.data && groupResp.data[0];
        setGroup(groupData || null);
        if (groupData?.courseId) {
          const courseResp = await getCourses([groupData.courseId]);
          setCourse(courseResp.data && courseResp.data[0] ? courseResp.data[0] : null);
        }
        if (groupData?.departmentId) {
          const depResp = await getDepartments([groupData.departmentId]);
          setDepartment(depResp.data && depResp.data[0] ? depResp.data[0] : null);
        }
      }
    };
    fetchGroupInfo();
  }, [account?.groupId]);

  const handleChangePassword = () => {
    if (account) {
      setAuthData((prev: any) => ({
        ...prev,
        account: { ...prev.account, mustChangePassword: true },
      }));
    }
    navigate("/change-password");
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 500, margin: "0 auto" }}>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Профиль пользователя
        </Typography>
        <Typography variant="body1">
          <b>ФИО:</b> {account ? `${account.surname} ${account.name}${account.patronymic ? ` ${account.patronymic}` : ''}` : '-'}
        </Typography>
        <Typography variant="body1">
          <b>Email:</b> {account?.email || "-"}
        </Typography>
        <Typography variant="body1">
          <b>Роль:</b> {account?.role?.name || "-"}
        </Typography>
        {group && (
          <Typography variant="body1">
            <b>Группа:</b> {group.name}
          </Typography>
        )}
        {course && (
          <Typography variant="body1">
            <b>Курс:</b> {course.name}
          </Typography>
        )}
        {department && (
          <Typography variant="body1">
            <b>Факультет:</b> {department.name}
          </Typography>
        )}
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          component={Link}
          to="/change-password"
          onClick={handleChangePassword}
        >
          Сменить пароль
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountProfile;
