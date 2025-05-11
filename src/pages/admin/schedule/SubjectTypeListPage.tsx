import React from "react";
import { getSubjectTypes, deleteSubjectTypes } from "../../../api/schedule/subject-type";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SubjectType } from "../../../types/schedule";

const SubjectTypeListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: SubjectType) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteSubjectTypes([id]);
  };

  const SubjectTypeCard: React.FC<{ entity: SubjectType }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: SubjectType) => navigate(`/admin/subject-type/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<SubjectType>
      title="Типы учебных предметов"
      fetchEntities={() => getSubjectTypes([])}
      ListItemComponent={SubjectTypeCard}
      onCreate={() => navigate("/admin/subject-type/edit")}
    />
  );
};

export default SubjectTypeListPage;
