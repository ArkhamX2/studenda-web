import React from "react";
import { getDisciplines, deleteDisciplines } from "../../../api/schedule/discipline";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Discipline } from "../../../types/schedule";

const DisciplineListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: Discipline) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteDisciplines([id]);
  };

  const DisciplineCard: React.FC<{ entity: Discipline }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Discipline) => navigate(`/admin/discipline/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Discipline>
      title="Учебные дисциплины"
      fetchEntities={() => getDisciplines([])}
      ListItemComponent={DisciplineCard}
      onCreate={() => navigate("/admin/discipline/edit")}
    />
  );
};

export default DisciplineListPage;
