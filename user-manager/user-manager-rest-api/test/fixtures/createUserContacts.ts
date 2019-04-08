import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';

export function createUserContacts(database: PgDatabaseConnection): Promise<void> {
  const query = `INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref)
                 VALUES($[userId], $[contactType], $[contactRef])`;

  const getUserContactQueries: GetQueries<unknown> = t => {
    const createUserContactQueries: Array<Promise<Array<unknown>>> = [];
    createUserContactQueries.push(t.any(query, {
      contactRef: 'jkomyno',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'jkomyno',
      contactType: ThirdPartyContactService.SLACK,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'alberto.schiabel@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'frispo',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 2,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'frispo@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 2,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'enrico_dogen',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 3,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'enrico_dogen',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 3,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'eleonora_signor',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 4,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'eleonora_signor@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 4,
    }));

    return createUserContactQueries;
  };

  return database.transaction(getUserContactQueries);
}
