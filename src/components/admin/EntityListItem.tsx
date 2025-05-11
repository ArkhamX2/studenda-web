import React, { useState } from "react";
import { ListItem, Card, CardActionArea, CardContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EntityListItemProps<T> {
  entity: T;
  onRender: (entity: T) => React.ReactNode;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (entity: T) => void;
}

function EntityListItem<T>({
  entity,
  onRender,
  onDelete,
  onEdit,
}: EntityListItemProps<T>): React.JSX.Element {
  const [isDeleted, setDeleted] = useState(false);

  const handleDelete = async (id: number) => {
    if (onDelete) {
      try {
        await onDelete(id);
        setDeleted(true);
      } catch (error) {
        console.error(`Failed to delete entity with id ${id}:`, error);
      }
    }
  };

  if (isDeleted) return <></>;

  return (
    <ListItem disablePadding>
      <Card sx={{ width: "100%", position: "relative" }}>
        <CardActionArea onClick={() => onEdit && onEdit(entity)}>
          <CardContent>{onRender(entity)}</CardContent>
        </CardActionArea>
        {onDelete && (
          <IconButton
            color="error"
            onClick={() => handleDelete((entity as any).id)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Card>
    </ListItem>
  );
}

export default EntityListItem;
