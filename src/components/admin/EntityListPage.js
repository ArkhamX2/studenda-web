import React, { useEffect, useState } from "react";
import { Container, Typography, List, Button } from "@mui/material";
import { useLoading } from "../LoadingProvider";

const EntityListPage = ({ title, fetchEntities, ListItemComponent, onCreate }) => {
  const [entities, setEntities] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      const response = await fetchEntities();
      if (response.success) {
        setEntities(response.data);
      } else {
        console.error(`Failed to fetch ${title}`);
      }
      stopLoading();
    };
    fetchData();
  }, [fetchEntities]);

  const handleAdd = () => {
    if (onCreate) {
      onCreate();
    } else {
      console.log("Add new entity");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAdd}>
        Добавить
      </Button>
      <List>
        {entities.map((entity) => (
          <ListItemComponent entity={entity} />
        ))}
      </List>
    </Container>
  );
};

export default EntityListPage;
