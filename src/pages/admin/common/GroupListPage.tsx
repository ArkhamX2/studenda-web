import React from "react";
import { getGroups, deleteGroups } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Group } from "../../../types/common";

const GroupListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: Group) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteGroups([id]);
  };

  const GroupCard: React.FC<{ entity: Group }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Group) => navigate(`/admin/group/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Group>
      title="Группы"
      fetchEntities={() => getGroups([])}
      ListItemComponent={GroupCard}
      onCreate={() => navigate("/admin/group/edit")}
    />
  );
};

export default GroupListPage;
