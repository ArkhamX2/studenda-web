import React from "react";
import { getWeekTypes, deleteWeekTypes } from "../../../api/schedule/week-type";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const WeekTypeListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderWeekTypeCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteWeekTypes([id])}
      onEdit={(entity) => navigate(`/admin/week-type/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Типы учебных недель"
      fetchEntities={() => getWeekTypes([])}
      ListItemComponent={renderWeekTypeCard}
      onCreate={() => navigate(`/admin/week-type/edit`)}
    />
  );
};

export default WeekTypeListPage;
