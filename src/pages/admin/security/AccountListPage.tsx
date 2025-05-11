import React from "react";
import { getAccounts, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { Account } from "../../../types/security";

const AccountListPage: React.FC = () => {
  const renderContent = (entity: Account) => (
    <>
      <Typography variant="h6">{`${entity.surname} ${entity.name} ${entity.patronymic || ""}`}</Typography>
      <Typography variant="body2" color="textSecondary">{entity.email}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteAccounts([id]);
  };

  const AccountCard: React.FC<{ entity: Account }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Account) => console.log(`Edit account`, entity)}
    />
  );

  return (
    <EntityListPage<Account>
      title="Пользователи"
      fetchEntities={() => getAccounts([])}
      ListItemComponent={AccountCard}
      onCreate={() => console.log("Create new account")}
    />
  );
};

export default AccountListPage;
