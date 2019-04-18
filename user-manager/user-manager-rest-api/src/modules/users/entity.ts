export interface CreateUser {
  email: string;
  firstname: string;
  lastname: string;
}

export interface User extends CreateUser {
  created?: Date;
  updated?: Date;
  userId?: string;
}
