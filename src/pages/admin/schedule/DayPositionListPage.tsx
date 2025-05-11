import React from "react";
import { getDayPositions, deleteDayPositions } from "../../../api/schedule/dayPosition";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DayPosition } from "../../../types/schedule";

const DayPositionListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: DayPosition) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteDayPositions([id]);
  };

  const DayPositionCard: React.FC<{ entity: DayPosition }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: DayPosition) => navigate(`/admin/day-position/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<DayPosition>
      title="Позиции учебного дня"
      fetchEntities={() => getDayPositions([])}
      ListItemComponent={DayPositionCard}
      onCreate={() => navigate("/admin/day-position/edit")}
    />
  );
};

export default DayPositionListPage;
