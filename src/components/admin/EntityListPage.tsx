import React, { useEffect, useState } from "react";
import { Container, Typography, List, Button, Box } from "@mui/material";

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Создать
        </Button>
      </Box>
      <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
        {entities.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
            Нет данных для отображения
          </Typography>
        ) : (
          entities.map((entity, index) => (
            <ListItemComponent key={index} entity={entity} />
          ))
        )}
      </List>
    </Container>
  );
}

export default EntityListPage;
