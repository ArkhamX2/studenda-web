import { Identifiable } from "./common";

export interface Task extends Identifiable {
  disciplineId: number;
  subjectTypeId: number;
  issuerAccountId: number;
  assigneeAccountId: number;
  markTypeId: number;
  mark: number | null;
  name: string;
  description: string | null;
  startedAt: string | null;
  endedAt: string | null;
}

export interface Session extends Identifiable {
  subjectId: number;
  startedAt: string | null;
}

export interface Absence extends Identifiable {
  accountId: number;
  sessionId: number;
}

export interface MarkType extends Identifiable {
  name: string;
  minValue: number;
  maxValue: number;
}
