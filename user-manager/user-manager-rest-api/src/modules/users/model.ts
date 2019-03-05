import { User } from './entity';

export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
}

export class UserModel {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  created: Date;
  updated: Date;

  constructor(user: User) {
    this.id = user.id!;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.created = user.created;
    this.updated = user.updated;
  }
}
