import React from "react";
import { Link } from "react-router-dom";
import RequireStudent from "../../components/security/require/RequireStudent";
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import { Box } from "@mui/material";

const StudentPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("student");

  return (
    <RequireStudent>
      <UserHeader
        title="Студент"
        accountPath={accountPath}
        menuLinks={menuLinks}
      />
      <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, margin: "0 auto" }}>
        <h1>Welcome, Student</h1>
        <p>This is the student dashboard.</p>
        <div className="schedule">
          <h2>Weekly Schedule</h2>
          <p>Schedule will be displayed here.</p>
        </div>
        <div className="button-group">
          <Link to="/journal">
            <button>Go to General Journal</button>
          </Link>
        </div>
      </Box>
    </RequireStudent>
  );
};

export default StudentPage;
