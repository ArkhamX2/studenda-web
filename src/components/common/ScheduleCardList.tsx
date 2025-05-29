import React from "react";
import { Box, Typography, Fade, Card, CardContent, CardActions, Button, Avatar } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';

interface ScheduleCardListProps {
  subjects: any[];
  related: any;
  expanded: number | null;
  setExpanded: (id: number | null) => void;
  currentId?: number | null;
  mode: "teacher" | "student";
  date: Date;
  navigate?: (url: string) => void;
}

const ScheduleCardList: React.FC<ScheduleCardListProps> = ({
  subjects,
  related,
  expanded,
  setExpanded,
  currentId,
  mode,
  date,
  navigate,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {subjects.length === 0 ? (
      <Typography color="text.secondary">На этот день занятий нет</Typography>
    ) : (
      subjects.map((s: any) => {
        const discipline = related.disciplines[s.disciplineId];
        const subjectType = related.subjectTypes[s.subjectTypeId];
        const subjectPosition = related.subjectPositions[s.subjectPositionId];
        const isCurrent = currentId ? s.id === currentId : false;
        const expandedThis = isCurrent || expanded === s.id;
        return (
          <Fade in key={s.id}>
            <Card
              elevation={isCurrent ? 8 : 2}
              sx={{
                border: isCurrent ? '2px solid #1976d2' : '1px solid #e0e0e0',
                bgcolor: isCurrent ? 'rgba(25, 118, 210, 0.07)' : '#fff',
                borderRadius: 3,
                minHeight: 80,
                transition: 'all 0.3s',
                cursor: isCurrent ? 'default' : 'pointer',
                boxShadow: isCurrent ? 8 : 2,
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => {
                if (!isCurrent) setExpanded(expanded === s.id ? null : s.id);
              }}
            >
              <CardContent sx={{ pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: isCurrent ? 'primary.main' : 'grey.200', color: isCurrent ? '#fff' : 'grey.800', width: 40, height: 40 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {subjectPosition ? `${subjectPosition.startLabel} - ${subjectPosition.endLabel}` : ''}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                      {discipline?.name || '—'} <span style={{ fontWeight: 400, color: '#888', fontSize: 16 }}>({subjectType?.name || '—'})</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.classroom || '—'}
                      {mode === 'student' && related.accounts && related.accounts[s.accountId] && (
                        <Fade in={expandedThis} unmountOnExit>
                          <span style={{ marginLeft: 8, color: '#888' }}>
                            •&nbsp;&nbsp;{`${related.accounts[s.accountId].surname} ${related.accounts[s.accountId].name}${related.accounts[s.accountId].patronymic ? ` ${related.accounts[s.accountId].patronymic}` : ''}`}
                          </span>
                        </Fade>
                      )}
                      {mode === 'teacher' && related.groups && related.groups[s.groupId] && (
                        <Fade in={expandedThis} unmountOnExit>
                          <span style={{ marginLeft: 8, color: '#888' }}>
                            •&nbsp;&nbsp;{related.groups[s.groupId].name}
                          </span>
                        </Fade>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Fade in={expandedThis} unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    {discipline?.description && (
                      <Typography variant="body2" color="text.secondary">
                        {discipline.description}
                      </Typography>
                    )}
                    {discipline?.description && s.description && (
                      <Box sx={{ my: 1, borderBottom: '1px solid #eee' }} />
                    )}
                    {s.description && (
                      <Typography variant="body2" color="text.secondary">
                        {s.description}
                      </Typography>
                    )}
                  </Box>
                </Fade>
              </CardContent>
              <CardActions sx={{ pt: 0, pb: 1, pl: 7, justifyContent: 'space-between' }}>
                {!isCurrent && (
                  <Button size="small" onClick={e => { e.stopPropagation(); setExpanded(expanded === s.id ? null : s.id); }}>
                    {expanded === s.id ? "Свернуть" : "Подробнее"}
                  </Button>
                )}
                {expandedThis && navigate && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ ml: 'auto' }}
                    onClick={e => {
                      e.stopPropagation();
                      const dateStr = date.toISOString().slice(0, 10);
                      if (mode === "teacher") {
                        navigate(`/teacher/journal/${s.id}/${dateStr}`);
                      } else {
                        navigate(`/student/journal/${s.id}/${dateStr}`);
                      }
                    }}
                  >
                    Журнал
                  </Button>
                )}
              </CardActions>
            </Card>
          </Fade>
        );
      })
    )}
  </Box>
);

export default ScheduleCardList;
