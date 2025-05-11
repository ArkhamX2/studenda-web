import React from "react";
import { getDepartments, deleteDepartments } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DepartmentListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderDepartmentCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteDepartments([id])}
      onEdit={(entity) => navigate(`/admin/department/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Факультеты"
      fetchEntities={() => getDepartments([])}
      ListItemComponent={renderDepartmentCard}
      onCreate={() => navigate("/admin/department/edit")}
    />
  );
};

export default DepartmentListPage;
