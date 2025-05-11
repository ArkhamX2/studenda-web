import React from "react";
import { getAccounts, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { User } from "../../../types/User";

const UserListPage: React.FC = () => {
  const renderContent = (entity: User) => (
    <>
      <Typography variant="h6">{`${entity.surname} ${entity.name} ${entity.patronymic || ""}`}</Typography>
      <Typography variant="body2" color="textSecondary">{entity.email}</Typography>
    </>
  );

  const renderUserCard = (entity: User) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id: string) => deleteAccounts([id])}
      onEdit={(entity: User) => console.log(`Edit user`, entity)}
    />
  );

  return (
    <EntityListPage
      title="Пользователи"
      fetchEntities={() => getAccounts([])}
      ListItemComponent={renderUserCard}
      onCreate={() => console.log("Create new user")}
    />
  );
};

export default UserListPage;
