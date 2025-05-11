import React from "react";
import { getGroups, deleteGroups } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderGroupCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteGroups([id])}
      onEdit={(entity) => navigate(`/admin/group/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Группы"
      fetchEntities={() => getGroups([])}
      ListItemComponent={renderGroupCard}
      onCreate={() => navigate("/admin/group/edit")}
    />
  );
};

export default GroupListPage;
