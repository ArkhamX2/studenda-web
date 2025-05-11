import React, { useState } from "react";
import { ListItem, Card, CardActionArea, CardContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EntityListItem = ({ entity, onRender, onDelete, onEdit }) => {
  const [isDeleted, setDeleted] = useState(false);

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id)
        .then(() => setDeleted(true))
        .catch((error) => console.error(`Failed to delete entity with id ${id}:`, error));
    }
  };

  if (isDeleted) return null;

  entity = entity.entity || {};

  return (
    <ListItem key={entity.id} disablePadding>
      <Card sx={{ width: "100%", position: "relative" }}>
        <CardActionArea onClick={() => onEdit && onEdit(entity)}>
          <CardContent>
            {onRender ? onRender(entity) : (
              <>
                <h2>{entity.name}</h2>
                <p>{entity.description}</p>
              </>
            )}
          </CardContent>
        </CardActionArea>
        {onDelete && (
          <IconButton
            color="error"
            onClick={() => handleDelete(entity.id)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Card>
    </ListItem>
  );
};

export default EntityListItem;
