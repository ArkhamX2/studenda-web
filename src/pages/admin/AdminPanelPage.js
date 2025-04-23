import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ManageUsersPage from "./ManageUsersPage";
import ManageSchedulesPage from "./ManageSchedulesPage";

function AdminPanelPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <div className="flex">
        <nav className="w-1/4 bg-white shadow-md p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="manage-users"
                className="block p-2 rounded hover:bg-blue-100 text-blue-600"
              >
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="manage-schedules"
                className="block p-2 rounded hover:bg-blue-100 text-blue-600"
              >
                Manage Schedules
              </Link>
            </li>
          </ul>
        </nav>
        <main className="w-3/4 p-6">
          <Routes>
            <Route path="manage-users" element={<ManageUsersPage />} />
            <Route path="manage-schedules" element={<ManageSchedulesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminPanelPage;
