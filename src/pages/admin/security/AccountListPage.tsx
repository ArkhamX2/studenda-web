import React from "react";
import { getAccounts, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Account } from "../../../types/security";

const AccountListPage: React.FC = () => {
  const navigate = useNavigate();

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
      onEdit={(entity: Account) => navigate(`/admin/user/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Account>
      title="Пользователи"
      fetchEntities={() => getAccounts([])}
      ListItemComponent={AccountCard}
      onCreate={() => navigate("/admin/user/edit")}
    />
  );
};

export default AccountListPage;
