import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Avatar, CircularProgress, Checkbox, List, ListItem, ListItemAvatar, ListItemText, Button, Alert } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import { Group } from "../../types/common";
import { Account } from "../../types/security";
import { Absence } from "../../types/journal";
import { Subject, SubjectType, SubjectPosition } from "../../types/schedule";
import { getSubjects } from "../../api/schedule/subject";
import { getSessionBySubject } from "../../api/journal/session";
import { getAbsenceBySession, setAbsences, deleteAbsences } from "../../api/journal/absence";
import { getAccountByGroups, getAccounts } from "../../api/security/account";
import { getGroups } from "../../api/common";
import { getDisciplines } from "../../api/schedule/discipline";
import { getSubjectTypes } from "../../api/schedule/subject-type";
import { getSubjectPositions } from "../../api/schedule/subject-position";

interface JournalViewProps {
  subjectId: string;
  date: string;
  mode: "teacher" | "student";
}

const JournalView: React.FC<JournalViewProps> = ({ subjectId, date, mode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Account[]>([]);
  const [absences, setAbsencesState] = useState<Absence[]>([]);
  const [markedAbsences, setMarkedAbsences] = useState<{ [accountId: number]: boolean }>({});
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null);
  const [subjectPosition, setSubjectPosition] = useState<SubjectPosition | null>(null);
  const [teacher, setTeacher] = useState<Account | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const subjResp = await getSubjects([Number(subjectId)]);
        const subj = subjResp.data?.[0] || null;
        setSubject(subj);
        let groupObj: Group | null = null;
        let studentsArr: Account[] = [];
        if (subj?.groupId) {
          const groupResp = await getGroups([subj.groupId]);
          groupObj = groupResp.data?.[0] || null;
          const studentsResp = await getAccountByGroups([subj.groupId]);
          studentsArr = studentsResp.data || [];
        }
        setGroup(groupObj);
        setStudents(studentsArr);
        let abs: Absence[] = [];
        let marked: { [accountId: number]: boolean } = {};
        let session = null;
        if (subj && date) {
          const sessionResp = await getSessionBySubject(subj.id, [date]);
          session = sessionResp.data?.[0] || null;
        }
        if (session) {
          const absencesResp = await getAbsenceBySession(session.id, studentsArr.map(s => s.id));
          abs = absencesResp.data || [];
          studentsArr.forEach(s => {
            marked[s.id] = !abs.find(a => a.accountId === s.id);
          });
        } else {
          abs = [];
          studentsArr.forEach(s => { marked[s.id] = true; });
        }
        setAbsencesState(abs);
        setMarkedAbsences(marked);
        if (subj) {
          const discResp = await getDisciplines([subj.disciplineId]);
          setDisciplines(discResp.data || []);
          // Получаем тип занятия
          if (subj.subjectTypeId) {
            const typeResp = await getSubjectTypes([subj.subjectTypeId]);
            setSubjectType(typeResp.data?.[0] || null);
          }
          // Получаем позицию занятия
          if (subj.subjectPositionId) {
            const posResp = await getSubjectPositions([subj.subjectPositionId]);
            setSubjectPosition(posResp.data?.[0] || null);
          }
          // Получаем преподавателя
          if (subj.accountId) {
            const teacherResp = await getAccounts([subj.accountId]);
            setTeacher(teacherResp.data?.[0] || null);
          }
        }
      } catch (e: any) {
        setError(e.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, date]);

  const canEdit = mode === "teacher";

  // Сохранение изменений (только для teacher)
  const handleSave = async () => {
    if (!canEdit || !subject || !date) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Получаем сессию
      const sessionResp = await getSessionBySubject(subject.id, [date]);
      const session = sessionResp.data?.[0] || null;
      if (!session) throw new Error('Сессия не найдена');
      // Формируем Absence[] для добавления и удаления
      const currentAbsenceMap: { [accountId: number]: Absence } = {};
      absences.forEach(a => { currentAbsenceMap[a.accountId] = a; });
      // Добавить: если у студента нет прогула, а галочка снята
      const toAdd = students
        .filter(s => !markedAbsences[s.id] && !currentAbsenceMap[s.id])
        .map(s => ({ id: 0, accountId: s.id, sessionId: session.id }));
      // Удалить: если у студента был прогул, а галочка теперь стоит
      const toRemove = absences.filter(a => markedAbsences[a.accountId]);
      if (toAdd.length > 0) {
        await setAbsences(toAdd);
      }
      if (toRemove.length > 0) {
        await deleteAbsences(toRemove.map(a => a.id));
      }
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения данных');
    } finally {
      setSaving(false);
    }
  };

  // Форматирование даты
  const formatDate = (d: string | Date | undefined) => {
    if (!d) return '—';
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.toLocaleDateString();
  };

  // Проверка: если дата больше текущей, не отображаем посещения
  const isFuture = (() => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    // Сравниваем только дату (без времени)
    d.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return d > now;
  })();

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!subject) return <Box sx={{ p: 4 }}><Typography color="error">Данные о занятии не найдены</Typography></Box>;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'grey.200', color: 'grey.800', width: 40, height: 40 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {subjectPosition ? `${subjectPosition.startLabel} - ${subjectPosition.endLabel}` : ''}
              </Typography>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                {disciplines[0]?.name || '—'} <span style={{ fontWeight: 400, color: '#888', fontSize: 16 }}>({subjectType?.name || '—'})</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subject?.classroom || '—'}
                {teacher && (
                    <span style={{ marginLeft: 8, color: '#888' }}>
                        •&nbsp;&nbsp;{`${teacher.surname} ${teacher.name}${teacher.patronymic ? ` ${teacher.patronymic}` : ''}`}
                    </span>
                )}
              </Typography>
            </Box>
          </Box>
          {/* Описания */}
          {(disciplines[0]?.description || subject?.description) && (
            <Box sx={{ mt: 2 }}>
              {disciplines[0]?.description && (
                <Typography variant="body2" color="text.secondary">
                  {disciplines[0].description}
                </Typography>
              )}
              {disciplines[0]?.description && subject?.description && (
                <Box sx={{ my: 1, borderBottom: '1px solid #eee' }} />
              )}
              {subject?.description && (
                <Typography variant="body2" color="text.secondary">
                  {subject.description}
                </Typography>
              )}
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
            {group?.name ? `Группа: ${group.name}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Дата: {formatDate(subject?.startedAt || date)}
          </Typography>
        </Paper>
        {/* Карточка посещаемости */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Посещение</Typography>
          {isFuture ? (
            <Typography color="text.secondary" variant="body2" align="center">
              Тут пока ничего нет
            </Typography>
          ) : (
            <>
              <List>
                {students.map(student => {
                  const isPresent = !!markedAbsences[student.id];
                  return (
                    <ListItem key={student.id} secondaryAction={
                      canEdit ? (
                        <Checkbox
                          checked={isPresent}
                          onChange={() => setMarkedAbsences(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                        />
                      ) : null
                    }>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: isPresent ? 'primary.main' : 'error.main' }}>
                          <SchoolIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<>
                          {`${student.surname || student.lastName} ${student.name || student.firstName}${student.patronymic ? ' ' + student.patronymic : ''}`}
                          {!isPresent && <Typography component="span" color="error" sx={{ ml: 1, fontWeight: 600 }}>(Отсутствует)</Typography>}
                        </>}
                      />
                    </ListItem>
                  );
                })}
              </List>
              {canEdit && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
                    Сохранить
                  </Button>
                  {success && <Alert severity="success">Сохранено</Alert>}
                  {error && <Alert severity="error">{error}</Alert>}
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default JournalView;
