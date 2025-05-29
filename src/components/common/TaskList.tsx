import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, CircularProgress, List, ListItem, ListItemText, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getTaskByIssuer, setTasks, deleteTasks } from "../../api/journal/task";
import { getMarkTypes } from "../../api/journal/markType";
import { Task, MarkType } from "../../types/journal";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getAcademicYear } from '../../utils/getAcademicYear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

dayjs.extend(isBetween);

interface TaskListProps {
  date: string;
  mode: "teacher" | "student";
  issuerAccountId: number;
  groupId: number;
  disciplineId: number;
  subjectTypeId: number;
  students?: { id: number; surname: string; name: string; patronymic?: string }[];
}

const TaskList: React.FC<TaskListProps> = ({ date, mode, issuerAccountId, groupId, disciplineId, subjectTypeId, students = [] }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [markTypes, setMarkTypesState] = useState<MarkType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    startedAt: date,
    endedAt: date
  });
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTaskGroup, setEditTaskGroup] = useState<{ name: string; description: string; startedAt: string; endedAt: string; assignees: number[] }>({ name: '', description: '', startedAt: date, endedAt: date, assignees: [] });

  // markTypeId: обязателен, но должен быть выбран первый доступный тип после загрузки markTypes
  const [newTaskMarkTypeId, setNewTaskMarkTypeId] = useState<number | undefined>(undefined);
  const [editTaskMarkTypeId, setEditTaskMarkTypeId] = useState<number | undefined>(undefined);

  const canEdit = mode === "teacher";

  // Вычисляем учебный год по дате для всего компонента
  const computedAcademicYear = getAcademicYear(date);

  // Группировка заданий по названию
  const groupedTasks = Object.values(tasks.reduce((acc, t) => {
    if (!acc[t.name]) acc[t.name] = { name: t.name, description: t.description, startedAt: t.startedAt, endedAt: t.endedAt, tasks: [], assignees: [] };
    acc[t.name].tasks.push(t);
    acc[t.name].assignees.push(t.assigneeAccountId);
    return acc;
  }, {} as Record<string, { name: string; description: string | null; startedAt: string | null; endedAt: string | null; tasks: Task[]; assignees: number[] }>));

  // Универсальная функция для фильтрации и установки заданий по дате
  const setFilteredTasks = (tasks: Task[]) => {
    const d = dayjs(date, 'YYYY-MM-DD');
    setTasksState(tasks.filter(t => {
      const start = t.startedAt ? dayjs(t.startedAt, 'YYYY-MM-DD') : null;
      const end = t.endedAt ? dayjs(t.endedAt, 'YYYY-MM-DD') : null;

      if (start && end) return d.isBetween(start, end, null, '[]');
      if (start) return d.isSame(start) || d.isAfter(start);
      if (end) return d.isSame(end) || d.isBefore(end);
      return true;
    }));
  };

  useEffect(() => {
    const fetchTasksAndMarkTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Грузим все типы оценок (их мало)
        const allMarkTypesResp = await getMarkTypes([]);
        setMarkTypesState(allMarkTypesResp.data || []);
        // Если нет выбранного типа оценки — выбрать первый из списка
        if (Array.isArray(allMarkTypesResp.data) && allMarkTypesResp.data.length > 0) {
          setNewTaskMarkTypeId(prev => prev ?? allMarkTypesResp.data![0].id);
          setEditTaskMarkTypeId(prev => prev ?? allMarkTypesResp.data![0].id);
        }
        if (!issuerAccountId || !groupId || !disciplineId || !subjectTypeId) {
          setTasksState([]);
          setLoading(false);
          return;
        }
        // Определяем учебный год по дате (используем startedAt первого задания или today)
        let yearForQuery = 0;
        if (date) {
          yearForQuery = getAcademicYear(date);
        } else {
          yearForQuery = getAcademicYear();
        }
        const resp = await getTaskByIssuer(
          issuerAccountId,
          [groupId],
          disciplineId,
          subjectTypeId,
          yearForQuery
        );
        setFilteredTasks(resp.data || []);
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки заданий");
      } finally {
        setLoading(false);
      }
    };
    fetchTasksAndMarkTypes();
  }, [issuerAccountId, groupId, disciplineId, subjectTypeId, date]);

  // Сегодняшний день в локальном формате YYYY-MM-DD (корректно для России)
  const todayIso = dayjs().format('YYYY-MM-DD');

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setNewTask({ name: "", description: "", startedAt: date, endedAt: date });
    if (markTypes.length > 0) setNewTaskMarkTypeId(markTypes[0].id);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewTask({ name: "", description: "", startedAt: date, endedAt: date });
    if (markTypes.length > 0) setNewTaskMarkTypeId(markTypes[0].id);
  };
  const handleDialogSave = async () => {
    if (!newTask.name.trim() || !newTaskMarkTypeId || !newTask.startedAt || !newTask.endedAt) return;
    try {
      let assignees = selectedStudents.length > 0 ? selectedStudents : students.map(s => s.id);
      const startedAt = newTask.startedAt ? dayjs(newTask.startedAt).format('YYYY-MM-DD') : '';
      const endedAt = newTask.endedAt ? dayjs(newTask.endedAt).format('YYYY-MM-DD') : '';
      const tasksToAdd: Task[] = assignees.map(assigneeId => ({
        id: 0,
        disciplineId,
        subjectTypeId,
        issuerAccountId,
        assigneeAccountId: assigneeId,
        markTypeId: newTaskMarkTypeId,
        mark: null,
        name: newTask.name,
        description: newTask.description,
        startedAt,
        endedAt
      }));
      await setTasks(tasksToAdd);
      const resp = await getTaskByIssuer(
        issuerAccountId,
        [groupId],
        disciplineId,
        subjectTypeId,
        computedAcademicYear
      );
      setFilteredTasks(resp.data || []);
      handleDialogClose();
      setSelectedStudents([]);
      if (markTypes.length > 0) setNewTaskMarkTypeId(markTypes[0].id);
    } catch (e) {
      setError("Ошибка добавления");
    }
  };

  // Открыть диалог редактирования группы заданий
  const handleEditGroup = (group: typeof groupedTasks[0]) => {
    setEditTaskGroup({
      name: group.name,
      description: group.description || '',
      startedAt: group.startedAt || todayIso,
      endedAt: group.endedAt || todayIso,
      assignees: group.assignees
    });
    setEditTaskMarkTypeId(group.tasks && group.tasks.length > 0 ? group.tasks[0].markTypeId : (markTypes[0]?.id));
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditTaskGroup({ name: '', description: '', startedAt: date, endedAt: date, assignees: [] });
  };
  const handleEditDialogSave = async () => {
    if (!editTaskMarkTypeId || !editTaskGroup.startedAt || !editTaskGroup.endedAt) return;
    try {
      // Удаляем все старые задания этой группы
      const toDelete = tasks.filter(t => t.name === editTaskGroup.name).map(t => t.id);
      if (toDelete.length) await deleteTasks(toDelete);
      // Преобразуем даты к формату YYYY-MM-DD
      const startedAt = editTaskGroup.startedAt ? dayjs(editTaskGroup.startedAt).format('YYYY-MM-DD') : '';
      const endedAt = editTaskGroup.endedAt ? dayjs(editTaskGroup.endedAt).format('YYYY-MM-DD') : '';
      // Создаём новые задания для выбранных студентов
      const tasksToAdd: Task[] = editTaskGroup.assignees.map(assigneeId => ({
        id: 0,
        disciplineId,
        subjectTypeId,
        issuerAccountId,
        assigneeAccountId: assigneeId,
        markTypeId: editTaskMarkTypeId,
        mark: null,
        name: editTaskGroup.name,
        description: editTaskGroup.description,
        startedAt,
        endedAt
      }));
      await setTasks(tasksToAdd);
      const resp = await getTaskByIssuer(
        issuerAccountId,
        [groupId],
        disciplineId,
        subjectTypeId,
        computedAcademicYear
      );
      setFilteredTasks(resp.data || []);
      handleEditDialogClose();
      if (markTypes.length > 0) setEditTaskMarkTypeId(markTypes[0].id);
    } catch (e) {
      setError("Ошибка сохранения");
    }
  };

  // Удаление группы заданий по имени
  const handleDeleteGroup = async (groupName: string) => {
    try {
      const toDelete = tasks.filter(t => t.name === groupName).map(t => t.id);
      if (toDelete.length) await deleteTasks(toDelete);
      // Используем вычисленный учебный год по дате
      const yearForQuery = getAcademicYear(date);
      const resp = await getTaskByIssuer(
        issuerAccountId,
        [groupId],
        disciplineId,
        subjectTypeId,
        yearForQuery
      );
      setFilteredTasks(resp.data || []);
    } catch (e) {
      setError("Ошибка удаления");
    }
  };

  if (loading) return <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={24} /></Box>;

  return (
    <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Задания</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List sx={{ px: 0 }}>
        {groupedTasks.length === 0 && (
          <Typography color="text.secondary" variant="body2" align="center">
            Тут пока ничего нет
          </Typography>
        )}
        {groupedTasks.map(group => {
          const start = group.startedAt ? dayjs(group.startedAt).format('DD.MM.YYYY') : '';
          const end = group.endedAt ? dayjs(group.endedAt).format('DD.MM.YYYY') : '';
          const markType = group.tasks[0]?.markTypeId ? markTypes.find(mt => mt.id === group.tasks[0].markTypeId) : null;
          return (
            <ListItem
              key={group.name}
              sx={{
                bgcolor: '#f7fafd',
                borderRadius: 2,
                mb: 1.5,
                boxShadow: 1,
                alignItems: 'flex-start',
                px: 2,
                py: 1.5,
                transition: 'box-shadow 0.2s, background 0.2s',
                '&:hover': { boxShadow: 4, background: '#e3f2fd' },
                cursor: canEdit ? 'pointer' : 'default',
              }}
              {...(canEdit ? { button: true, onClick: () => handleEditGroup(group) } : {})}
              secondaryAction={canEdit && (
                <IconButton edge="end" aria-label="delete" onClick={e => { e.stopPropagation(); handleDeleteGroup(group.name); }}>
                  <DeleteIcon />
                </IconButton>
              )}
            >
              <Box sx={{ mr: 2, mt: 0.5 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '50%', bgcolor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 20, boxShadow: 2
                }}>
                  <AccessTimeIcon fontSize="medium" />
                </Box>
              </Box>
              <ListItemText
                primary={<>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.2 }}>{group.name}</Typography>
                  {group.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{group.description}</Typography>
                  )}
                </>}
                secondary={
                  <>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
                      {(start || end) && (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {start}{start && end ? ' — ' : ''}{end && end !== start ? end : ''}
                          </Typography>
                        </Box>
                      )}
                      {markType && (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocalOfferIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                          <Typography variant="caption" color="#1976d2">{markType.name}</Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
      {/* Диалог редактирования группы заданий */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Редактировать задание</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
          <TextField
            label="Название"
            value={editTaskGroup.name}
            onChange={e => setEditTaskGroup(g => ({ ...g, name: e.target.value }))}
            fullWidth
            autoFocus
          />
          <TextField
            label="Описание"
            value={editTaskGroup.description}
            onChange={e => setEditTaskGroup(g => ({ ...g, description: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="Дата начала"
              value={editTaskGroup.startedAt ? dayjs(editTaskGroup.startedAt) : null}
              onChange={(val: dayjs.Dayjs | null) => setEditTaskGroup(g => ({ ...g, startedAt: val ? val.toISOString() : '' }))}
              format="DD.MM.YYYY"
              slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
            />
            <DatePicker
              label="Дата окончания"
              value={editTaskGroup.endedAt ? dayjs(editTaskGroup.endedAt) : null}
              onChange={(val: dayjs.Dayjs | null) => setEditTaskGroup(g => ({ ...g, endedAt: val ? val.toISOString() : '' }))}
              format="DD.MM.YYYY"
              slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Тип оценки"
            value={editTaskMarkTypeId ?? ''}
            onChange={e => setEditTaskMarkTypeId(Number(e.target.value))}
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mt: 1 }}
          >
            {markTypes.map(mt => (
              <option key={mt.id} value={mt.id}>{mt.name}</option>
            ))}
          </TextField>
          {/* Список студентов с множественным выбором */}
          {students.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Назначить студентам</Typography>
              <Box sx={{
                maxHeight: 180,
                overflow: 'auto',
                border: '1px solid #eee',
                borderRadius: 1,
                p: 1,
                background: '#fafbfc',
                boxShadow: 1
              }}>
                {students.map(s => (
                  <Box
                    key={s.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 0.5,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      transition: 'background 0.2s',
                      '&:hover': { background: '#f0f4ff' },
                      background: editTaskGroup.assignees.includes(s.id) ? '#e3f2fd' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editTaskGroup.assignees.includes(s.id)}
                      onChange={e => {
                        setEditTaskGroup(g => ({
                          ...g,
                          assignees: e.target.checked
                            ? [...g.assignees, s.id]
                            : g.assignees.filter(id => id !== s.id)
                        }));
                      }}
                      id={`edit-student-${s.id}`}
                      style={{ accentColor: '#1976d2', width: 18, height: 18 }}
                    />
                    <label htmlFor={`edit-student-${s.id}`} style={{ marginLeft: 12, cursor: 'pointer', fontWeight: 500, color: editTaskGroup.assignees.includes(s.id) ? '#1976d2' : undefined }}>
                      {s.surname} {s.name}{s.patronymic ? ` ${s.patronymic}` : ''}
                    </label>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Если не выбрано ни одного — задание будет создано для всех студентов группы
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Отмена</Button>
          <Button onClick={handleEditDialogSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
      {canEdit && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="contained" onClick={handleDialogOpen}>Добавить задание</Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Новое задание</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
          <TextField
            label="Название"
            value={newTask.name}
            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
            fullWidth
            autoFocus
          />
          <TextField
            label="Описание"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            fullWidth
            multiline
            minRows={2}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="Дата начала"
              value={newTask.startedAt ? dayjs(newTask.startedAt) : null}
              onChange={(val: dayjs.Dayjs | null) => setNewTask(nt => ({ ...nt, startedAt: val ? val.toISOString() : '' }))}
              format="DD.MM.YYYY"
              slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
            />
            <DatePicker
              label="Дата окончания"
              value={newTask.endedAt ? dayjs(newTask.endedAt) : null}
              onChange={(val: dayjs.Dayjs | null) => setNewTask(nt => ({ ...nt, endedAt: val ? val.toISOString() : '' }))}
              format="DD.MM.YYYY"
              slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Тип оценки"
            value={newTaskMarkTypeId ?? ''}
            onChange={e => setNewTaskMarkTypeId(Number(e.target.value))}
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mt: 1 }}
          >
            {markTypes.map(mt => (
              <option key={mt.id} value={mt.id}>{mt.name}</option>
            ))}
          </TextField>
          {/* Список студентов с множественным выбором */}
          {students.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Назначить студентам</Typography>
              <Box sx={{
                maxHeight: 180,
                overflow: 'auto',
                border: '1px solid #eee',
                borderRadius: 1,
                p: 1,
                background: '#fafbfc',
                boxShadow: 1
              }}>
                {students.map(s => (
                  <Box
                    key={s.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 0.5,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      transition: 'background 0.2s',
                      '&:hover': { background: '#f0f4ff' },
                      background: selectedStudents.includes(s.id) ? '#e3f2fd' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s.id)}
                      onChange={e => {
                        setSelectedStudents(sel =>
                          e.target.checked
                            ? [...sel, s.id]
                            : sel.filter(id => id !== s.id)
                        );
                      }}
                      id={`student-${s.id}`}
                      style={{ accentColor: '#1976d2', width: 18, height: 18 }}
                    />
                    <label htmlFor={`student-${s.id}`} style={{ marginLeft: 12, cursor: 'pointer', fontWeight: 500, color: selectedStudents.includes(s.id) ? '#1976d2' : undefined }}>
                      {s.surname} {s.name}{s.patronymic ? ` ${s.patronymic}` : ''}
                    </label>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Если не выбрано ни одного — задание будет создано для всех студентов группы
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleDialogSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskList;
