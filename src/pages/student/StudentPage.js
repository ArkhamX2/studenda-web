import React from "react";
import { Link } from "react-router-dom";
import RequireStudent from "../../components/security/require/RequireStudent";

const StudentPage = () => {
  return (
    <RequireStudent>
      <div>
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
      </div>
    </RequireStudent>
  );
};

export default StudentPage;
