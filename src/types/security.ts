import { Entity, Identifiable, Group } from "./common";

export interface Settings extends Entity {
  defaultPermission: string;
  leaderPermission: string;
  teacherPermission: string;
  adminPermission: string;
  coordinatedUniversalTime: string;
}

export interface AuthResponse extends Entity {
  account: Account;
  token: string;
}

export interface Account extends Identifiable {
  surname: string;
  name: string;
  patronymic?: string;
  email: string;
  roleId: number;
  groupId: number | null;
  identityId: string | null;
  role: Role | null;
  group: Group | null;
}

export interface Role extends Identifiable {
  name: string;
  permission: string;
  tokenLifetimeSeconds: number;
  canRegister: boolean;
  accounts: any; // TODO
}
