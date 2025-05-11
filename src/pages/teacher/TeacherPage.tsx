import React from "react";
import RequireTeacher from "../../components/security/require/RequireTeacher";

const TeacherPage: React.FC = () => {
  return (
    <RequireTeacher>
      <div>
        <h1>Welcome, Teacher</h1>
        <p>This is the teacher dashboard.</p>
      </div>
    </RequireTeacher>
  );
};

export default TeacherPage;
