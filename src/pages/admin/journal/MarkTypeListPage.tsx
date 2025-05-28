import React from "react";
import { getMarkTypes, deleteMarkTypes } from "../../../api/journal/markType";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MarkType } from "../../../types/journal";

const MarkTypeListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: MarkType) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
      {entity.description && (
        <Typography variant="body2" color="textSecondary">{entity.description}</Typography>
      )}
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteMarkTypes([id]);
  };

  const MarkTypeCard: React.FC<{ entity: MarkType }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: MarkType) => navigate(`/admin/journal/mark-type/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<MarkType>
      title="Типы оценивания"
      fetchEntities={() => getMarkTypes([])}
      ListItemComponent={MarkTypeCard}
      onCreate={() => navigate("/admin/journal/mark-type/edit")}
    />
  );
};

export default MarkTypeListPage;
