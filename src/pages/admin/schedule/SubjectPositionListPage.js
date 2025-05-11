import React from "react";
import { getSubjectPositions, deleteSubjectPositions } from "../../../api/schedule/subject-position";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SubjectPositionListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderSubjectPositionCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteSubjectPositions([id])}
      onEdit={(entity) => navigate(`/admin/subject-position/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Позиции учебных предметов"
      fetchEntities={() => getSubjectPositions([])}
      ListItemComponent={renderSubjectPositionCard}
      onCreate={() => navigate(`/admin/subject-position/edit`)}
    />
  );
};

export default SubjectPositionListPage;
