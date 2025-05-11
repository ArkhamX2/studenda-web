import React from "react";
import { getSubjectPositions, deleteSubjectPositions } from "../../../api/schedule/subject-position";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SubjectPosition } from "../../../types/schedule";

const SubjectPositionListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: SubjectPosition) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteSubjectPositions([id]);
  };

  const SubjectPositionCard: React.FC<{ entity: SubjectPosition }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: SubjectPosition) => navigate(`/admin/subject-position/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<SubjectPosition>
      title="Позиции учебных предметов"
      fetchEntities={() => getSubjectPositions([])}
      ListItemComponent={SubjectPositionCard}
      onCreate={() => navigate("/admin/subject-position/edit")}
    />
  );
};

export default SubjectPositionListPage;
