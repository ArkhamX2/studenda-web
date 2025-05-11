import React from "react";
import { getCourses, deleteCourses } from "../../../api/common";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Course } from "../../../types/common";

const CourseListPage: React.FC = () => {
  const navigate = useNavigate();

  const renderContent = (entity: Course) => (
    <>
      <Typography variant="h6">{entity.name}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteCourses([id]);
  };

  const CourseCard: React.FC<{ entity: Course }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Course) => navigate(`/admin/course/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Course>
      title="Курсы"
      fetchEntities={() => getCourses([])}
      ListItemComponent={CourseCard}
      onCreate={() => navigate("/admin/course/edit")}
    />
  );
};

export default CourseListPage;
