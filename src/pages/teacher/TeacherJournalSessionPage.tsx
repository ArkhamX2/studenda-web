import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Box, Typography, Paper, Avatar, CircularProgress, Checkbox, List, ListItem, ListItemAvatar, ListItemText, Button, Alert } from "@mui/material";
import { getSessions, setSessions, getSessionBySubject } from "../../api/journal/session";
import { getAbsenceBySession, setAbsences, deleteAbsences } from "../../api/journal/absence";
import { getSubjects } from "../../api/schedule/subject";
import { getAccountByGroups } from "../../api/security/account";
import { getGroups } from "../../api/common";
import { Session, Absence } from "../../types/journal";
import { Account } from "../../types/security";
import { Group } from "../../types/common";
import { Subject } from "../../types/schedule";
import { Discipline } from "../../types/schedule";
import { getDisciplines } from "../../api/schedule/discipline";
import SchoolIcon from '@mui/icons-material/School';
import UserHeader, { useUserHeaderConfig } from "../../components/common/UserHeader";
import RequireTeacher from "../../components/security/require/RequireTeacher";

// Вспомогательные функции
const getSubjectFromParams = async (sessionId: string | undefined, searchParams: URLSearchParams): Promise<Subject | null> => {
  if (sessionId && !isNaN(Number(sessionId))) {
    const subjectResp = await getSubjects([Number(sessionId)]);
    return subjectResp.data?.[0] || null;
  } else if (searchParams.get('subjectId')) {
    const subjectResp = await getSubjects([Number(searchParams.get('subjectId'))]);
    return subjectResp.data?.[0] || null;
  }
  return null;
};

const getDateFromParams = (searchParams: URLSearchParams) => {
  const dateStr = searchParams.get('date');
  return dateStr ? new Date(dateStr) : new Date();
};

const getSessionForSubjectAndDate = async (subjectId: number, date: Date) => {
  const sessionResp = await getSessionBySubject(subjectId, [date.toISOString().slice(0, 10)]);
  return sessionResp.data?.[0] || null;
};

const getGroupAndStudents = async (groupId: number) => {
  const groupResp = await getGroups([groupId]);
  const group = groupResp.data?.[0] || null;
  const groupStudentsResp = await getAccountByGroups([groupId]);
  const students = groupStudentsResp.data || [];
  return { group, students };
};

const getAbsenceMap = (absences: Absence[], students: Account[]) => {
  const absenceMap: { [accountId: number]: boolean } = {};
  (absences || []).forEach(a => { absenceMap[a.accountId] = false; });
  students.forEach(s => {
    if (!(s.id in absenceMap)) absenceMap[s.id] = true;
  });
  return absenceMap;
};

const TeacherJournalSessionPage: React.FC = () => {
  const { accountPath, menuLinks } = useUserHeaderConfig("teacher");
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Account[]>([]);
  const [absences, setAbsencesState] = useState<Absence[]>([]);
  const [markedAbsences, setMarkedAbsences] = useState<{ [accountId: number]: boolean }>({});
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const dateParam = searchParams.get('date');

  // useEffect для загрузки subject и session
  useEffect(() => {
    const fetchSubjectAndSession = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const subjectObj = await getSubjectFromParams(sessionId, searchParams);
        setSubject(subjectObj);
        const dateObj = getDateFromParams(searchParams);
        let sessionObj: Session | null = null;
        if (subjectObj && dateObj) {
          sessionObj = await getSessionForSubjectAndDate(subjectObj.id, dateObj);
        }
        setSession(sessionObj);
      } catch (e) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectAndSession();
    // eslint-disable-next-line
  }, [sessionId, searchParams]);

  // useEffect для загрузки студентов и группы
  useEffect(() => {
    const fetchGroupAndStudents = async () => {
      if (!subject) return;
      if (subject.groupId) {
        const { group, students } = await getGroupAndStudents(subject.groupId);
        setGroup(group);
        setStudents(students);
      }
    };
    fetchGroupAndStudents();
  }, [subject]);

  // useEffect для загрузки прогулов (после загрузки студентов и session)
  useEffect(() => {
    const fetchAbsences = async () => {
      if (!session || students.length === 0) {
        setAbsencesState([]);
        const allPresent: { [accountId: number]: boolean } = {};
        students.forEach(s => { allPresent[s.id] = true; });
        setMarkedAbsences(allPresent);
        return;
      }
      const absencesResp = await getAbsenceBySession(session.id, students.map((s: Account) => s.id));
      setAbsencesState(absencesResp.data || []);
      setMarkedAbsences(getAbsenceMap(absencesResp.data || [], students));
    };
    fetchAbsences();
  }, [session, students]);

  // useEffect для загрузки дисциплин
  useEffect(() => {
    if (!subject) return;
    getDisciplines([subject.disciplineId]).then(resp => setDisciplines(resp.data || []));
  }, [subject]);

  // Обработка отметки прогула
  const handleToggleAbsence = (accountId: number) => {
    setMarkedAbsences(prev => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  // Сохранение сессии и прогулов
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      let sessionObj = session;
      // Если сессии нет — создаём
      if (!sessionObj && subject) {
        const newSession: Session = {
          id: 0,
          subjectId: subject.id,
          startedAt: dateParam ? new Date(dateParam).toISOString() : new Date().toISOString(),
        };
        await setSessions([newSession]);
        // Получаем созданную сессию
        const sessionResp = await getSessions([]); // TODO: заменить на получение по subjectId+date если есть api
        sessionObj = sessionResp.data?.find((s: Session) => s.subjectId === subject.id && s.startedAt?.slice(0, 10) === (dateParam || '').slice(0, 10)) || null;
        setSession(sessionObj || null);
      }
      if (!sessionObj) throw new Error('Не удалось создать сессию');

      // Определяем, какие прогулы нужно добавить и какие удалить
      // absences: текущие прогулы из API (Absence[]), markedAbsences: { [accountId]: boolean }
      const currentAbsenceMap: { [accountId: number]: Absence } = {};
      absences.forEach(a => { currentAbsenceMap[a.accountId] = a; });

      // Добавить: если у студента нет прогула, а галочка снята
      const toAdd: Absence[] = students
        .filter(s => !markedAbsences[s.id] && !currentAbsenceMap[s.id])
        .map(s => ({ id: 0, accountId: s.id, sessionId: sessionObj!.id }));
      // Удалить: если у студента был прогул, а галочка теперь стоит
      const toRemove: Absence[] = absences.filter(a => markedAbsences[a.accountId]);

      // Добавляем новые прогулы
      if (toAdd.length > 0) {
        await setAbsences(toAdd);
      }
      // Удаляем снятые прогулы через API
      if (toRemove.length > 0) {
        await deleteAbsences(toRemove.map(a => a.id));
      }
      setSuccess(true);
    } catch (e) {
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!subject) return <Box sx={{ p: 4 }}><Typography color="error">Данные о занятии не найдены</Typography></Box>;

  return (
    <RequireTeacher>
      <Box sx={{ minHeight: '100vh', background: '#f7f8fa', transition: 'background 0.5s', pb: 0 }}>
        <UserHeader title="Журнал посещения" accountPath={accountPath} menuLinks={menuLinks} />
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Журнал посещения</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {(disciplines[0]?.name || subject?.disciplineId || '—')} • {subject.classroom || '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {group?.name ? `Группа: ${group.name}` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Дата: {session?.startedAt ? new Date(session.startedAt).toLocaleDateString() : (dateParam ? new Date(dateParam).toLocaleDateString() : '—')}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Список студентов</Typography>
            <List>
              {students.map(student => {
                const isPresent = !!markedAbsences[student.id];
                return (
                  <ListItem key={student.id} secondaryAction={
                    <Checkbox
                      checked={isPresent}
                      onChange={() => handleToggleAbsence(student.id)}
                      color="success"
                    />
                  }>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: isPresent ? 'success.main' : 'error.main' }}>
                        <SchoolIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<>
                        {`${student.surname} ${student.name}${student.patronymic ? ' ' + student.patronymic : ''}`}
                        {!isPresent && <Typography component="span" color="error" sx={{ ml: 1, fontWeight: 600 }}>(Прогул)</Typography>}
                      </>}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
                Сохранить
              </Button>
              {success && <Alert severity="success">Сохранено</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </Paper>
        </Box>
      </Box>
    </RequireTeacher>
  );
};

export default TeacherJournalSessionPage;
