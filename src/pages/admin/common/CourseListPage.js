import React from "react";
import { getCourses, deleteCourses } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseListPage = () => {
  const navigate = useNavigate();

  const renderContent = (entity) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const renderCourseCard = (entity) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={(id) => deleteCourses([id])}
      onEdit={(entity) => navigate(`/admin/course/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage
      title="Курсы"
      fetchEntities={() => getCourses([])}
      ListItemComponent={renderCourseCard}
      onCreate={() => navigate("/admin/course/edit")}
    />
  );
};

export default CourseListPage;
