import React from "react";
import { getDayPositions, deleteDayPositions } from "../../../api/schedule/dayPosition";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DayPositionListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderDayPositionCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteDayPositions([id])}
      onEdit={(entity) => navigate(`/admin/day-position/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Позиции учебного дня"
      fetchEntities={() => getDayPositions([])}
      ListItemComponent={renderDayPositionCard}
      onCreate={() => navigate(`/admin/day-position/edit`)}
    />
  );
};

export default DayPositionListPage;
