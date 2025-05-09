import React from "react";
import { Link } from "react-router-dom";
import RequireAdmin from "../../components/security/require/RequireAdmin";

const AdminPage = () => {
  return (
    <RequireAdmin>
      <div>
        <h1>Welcome, Admin</h1>
        <p>This is the admin dashboard.</p>
        <div className="button-group">
          <Link to="/admin/edit-students">
            <button>Edit Students</button>
          </Link>
          <Link to="/admin/edit-schedules">
            <button>Edit Schedules</button>
          </Link>
          <Link to="/admin/edit-settings">
            <button>Edit Settings</button>
          </Link>
          <Link to="/admin/edit-journal">
            <button>Edit Journal</button>
          </Link>
          <Link to="/admin/edit-groups">
            <button>Edit Groups</button>
          </Link>
        </div>
      </div>
    </RequireAdmin>
  );
};

export default AdminPage;
