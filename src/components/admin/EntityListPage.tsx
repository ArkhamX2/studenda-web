import React, { useEffect, useState } from "react";
import { Container, Typography, List, Button } from "@mui/material";

interface EntityListPageProps<T> {
  title: string;
  fetchEntities: () => Promise<{ success: boolean; data: T[] | null }>;
  ListItemComponent: React.ComponentType<{ entity: T }>;
  onCreate?: () => void;
}

function EntityListPage<T>({
  title,
  fetchEntities,
  ListItemComponent,
  onCreate,
}: EntityListPageProps<T>): React.JSX.Element {
  const [entities, setEntities] = useState<T[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchEntities();
      if (response.success && response.data) {
        setEntities(response.data);
      } else {
        console.error(`Failed to fetch ${title}`);
      }
    };
    fetchData();
  }, [fetchEntities, title]);

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
        Создать
      </Button>
      <List>
        {entities.map((entity, index) => (
          <ListItemComponent key={index} entity={entity} />
        ))}
      </List>
    </Container>
  );
}

export default EntityListPage;
