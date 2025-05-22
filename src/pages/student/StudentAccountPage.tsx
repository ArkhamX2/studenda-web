import React from "react";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import AccountProfile from "../../components/common/AccountProfile";
import { useNavigate } from "react-router-dom";

const StudentAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountPath, menuLinks } = useUserHeaderConfig("student");
  return (
    <>
      <UserHeader
        title="Аккаунт"
        accountPath={accountPath}
        menuLinks={menuLinks}
      />
      <AccountProfile />
    </>
  );
};

export default StudentAccountPage;
