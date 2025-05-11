export interface Entity {
  [key: string]: any; // Allow additional fields
}

export interface Identifiable extends Entity {
  id: number;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface Course extends Identifiable {
  grade: number;
  name: string;
}

export interface Department extends Identifiable {
  name: string;
}

export interface Group extends Identifiable {
  name: string;
  courseId: number;
  departmentId: number;
}
