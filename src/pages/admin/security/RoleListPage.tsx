import React from "react";
import { getRoles, deleteRoles } from "../../../api/security/role";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Role } from "../../../types/security";

const RoleListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: Role) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        {entity.permission}
      </Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteRoles([id]);
  };

  const RoleCard: React.FC<{ entity: Role }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Role) => navigate(`/admin/role/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Role>
      title="Роли"
      fetchEntities={() => getRoles([])}
      ListItemComponent={RoleCard}
      onCreate={() => navigate("/admin/role/edit")}
    />
  );
};

export default RoleListPage;
