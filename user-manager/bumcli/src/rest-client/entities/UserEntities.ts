export interface CreateUser {
  email: string;
  firstname: string;
  lastname: string;
  enabled?: boolean;
}

export interface UpdateUser {
  email: string;
  firstname?: string;
  lastname?: string;
  enabled?: boolean;
}

export interface FindUser {
  email: string;
}

export type RemoveUser = FindUser;

export interface User extends CreateUser {
  userId: string;
  created: Date;
  modified: Date;
}
