import React from "react";
import { getSubjectTypes, deleteSubjectTypes } from "../../../api/schedule/subject-type";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SubjectTypeListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderSubjectTypeCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteSubjectTypes([id])}
      onEdit={(entity) => navigate(`/admin/subject-type/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Типы учебных предметов"
      fetchEntities={() => getSubjectTypes([])}
      ListItemComponent={renderSubjectTypeCard}
      onCreate={() => navigate(`/admin/subject-type/edit`)}
    />
  );
};

export default SubjectTypeListPage;
