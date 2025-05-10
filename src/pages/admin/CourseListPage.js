import React from "react";
import { getCourses } from "../../api/common";
import EntityListPage from "../../components/admin/EntityListPage";

const CourseListPage = () => {
  return <EntityListPage title="Курсы" fetchEntities={() => getCourses([])} />;
};

export default CourseListPage;
