export enum ContactService {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
  TELEGRAM = 'TELEGRAM',
}

export interface FindUserContacts {
  userEmail: string;
}

export interface RemoveUserContact extends FindUserContacts {
  service: ContactService;
}

export interface CreateUserContact extends RemoveUserContact {
  contactRef: string;
}

export type UpdateUserContact = CreateUserContact;

export interface UserContact {
  userContactId: number;
  userEmail: string;
  contactService: ContactService;
  contactRef: string;
}

export interface UserContacts {
 EMAIL?: string;
 SLACK?: string;
 TELEGRAM?: string;
}
