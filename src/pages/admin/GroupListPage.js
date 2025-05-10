import React from "react";
import { getGroups } from "../../api/common";
import EntityListPage from "../../components/admin/EntityListPage";

const GroupListPage = () => {
  return <EntityListPage title="Группы" fetchEntities={() => getGroups([])} />;
};

export default GroupListPage;
