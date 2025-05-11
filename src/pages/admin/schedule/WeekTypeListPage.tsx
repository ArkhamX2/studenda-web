import React from "react";
import { getWeekTypes, deleteWeekTypes } from "../../../api/schedule/week-type";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WeekType } from "../../../types/schedule";

const WeekTypeListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: WeekType) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteWeekTypes([id]);
  };

  const WeekTypeCard: React.FC<{ entity: WeekType }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: WeekType) => navigate(`/admin/week-type/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<WeekType>
      title="Типы учебных недель"
      fetchEntities={() => getWeekTypes([])}
      ListItemComponent={WeekTypeCard}
      onCreate={() => navigate("/admin/week-type/edit")}
    />
  );
};

export default WeekTypeListPage;
