import React from "react";
import { getAccounts } from "../../api/security/account";
import EntityListPage from "../../components/admin/EntityListPage";

const UserListPage = () => {
  return <EntityListPage title="Пользователи" fetchEntities={() => getAccounts([])} />;
};

export default UserListPage;
