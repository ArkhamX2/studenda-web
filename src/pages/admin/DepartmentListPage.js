import React from "react";
import { getDepartments } from "../../api/common";
import EntityListPage from "../../components/admin/EntityListPage";

const DepartmentListPage = () => {
  return <EntityListPage title="Факультеты" fetchEntities={() => getDepartments([])} />;
};

export default DepartmentListPage;
