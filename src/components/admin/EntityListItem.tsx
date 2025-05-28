import React, { useState } from "react";
import { ListItem, Card, CardActionArea, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && pendingDeleteId !== null) {
      try {
        await onDelete(pendingDeleteId);
        setDeleted(true);
      } catch (error) {
        console.error(`Failed to delete entity with id ${pendingDeleteId}:`, error);
      }
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  if (isDeleted) return <></>;

  return (
    <>
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
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>Вы действительно хотите удалить этот элемент?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Удалить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EntityListItem;
