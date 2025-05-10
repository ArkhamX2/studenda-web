import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useLoading } from "../LoadingProvider";

const EntityListPage = ({ title, fetchEntities }) => {
  const [entities, setEntities] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      const response = await fetchEntities();
      stopLoading();
      if (response.success) {
        setEntities(response.data);
      } else {
        console.error(`Failed to fetch ${title}`);
      }
    };
    fetchData();
  }, [fetchEntities, startLoading, stopLoading, title]);

  const handleDelete = (id) => {
    console.log(`Delete entity with id: ${id}`);
  };

  const handleAdd = () => {
    console.log("Add new entity");
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
          <ListItem key={entity.id} disablePadding>
            <Card sx={{ width: "100%" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6">{entity.name}</Typography>
                </CardContent>
              </CardActionArea>
              <Button color="error" onClick={() => handleDelete(entity.id)}>
                Удалить
              </Button>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EntityListPage;
