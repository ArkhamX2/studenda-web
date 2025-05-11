import React from "react";
import { getDepartments, deleteDepartments } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Department } from "../../../types/common";

const DepartmentListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: Department) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteDepartments([id]);
  };

  const DepartmentCard: React.FC<{ entity: Department }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Department) => navigate(`/admin/department/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Факультеты"
      fetchEntities={() => getDepartments([])}
      ListItemComponent={DepartmentCard}
      onCreate={() => navigate("/admin/department/edit")}
    />
  );
};

export default DepartmentListPage;
