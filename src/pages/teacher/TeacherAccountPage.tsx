import React from "react";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import AccountProfile from "../../components/common/AccountProfile";
import { useNavigate } from "react-router-dom";

const TeacherAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  return (
    <>
      <UserHeader
        title="Аккаунт преподавателя"
        accountPath={accountPath}
        menuLinks={menuLinks}
      />
      <AccountProfile />
    </>
  );
};

export default TeacherAccountPage;
