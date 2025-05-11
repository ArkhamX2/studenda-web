import React from "react";
import { getDisciplines, deleteDisciplines } from "../../../api/schedule/discipline";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DisciplineListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderDisciplineCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteDisciplines([id])}
      onEdit={(entity) => navigate(`/admin/discipline/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Учебные дисциплины"
      fetchEntities={() => getDisciplines([])}
      ListItemComponent={renderDisciplineCard}
      onCreate={() => navigate(`/admin/discipline/edit`)}
    />
  );
};

export default DisciplineListPage;
