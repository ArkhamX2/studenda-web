import { Identifiable } from "./common";

export interface DayPosition extends Identifiable {
  index: number;
  name: string;
}

export interface Discipline extends Identifiable {
  accountId: number;
  name: string;
  description: string;
}

export interface SubjectPosition extends Identifiable {
  index: number;
  startLabel: string;
  endLabel: string;
  name: string;
}

export interface SubjectType extends Identifiable {
  name: string;
}

export interface WeekType extends Identifiable {
  index: number;
  name: string;
}

export interface Subject extends Identifiable {
  disciplineId: number;
  subjectPositionId: number;
  dayPositionId: number;
  weekTypeId: number;
  subjectTypeId: number;
  accountId: number;
  groupId: number;
  academicYear: number;
  classroom: string;
  description: string;
}

export interface SubjectChange extends Identifiable {
  staticScheduleId: number | null;
  disciplineId: number | null;
  subjectTypeId: number | null;
  accountId: number | null;
  classroom: string | null;
  description: string | null;
}
