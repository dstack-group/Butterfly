import {DatabaseConnection } from '../../src/database';

export function truncData(database: DatabaseConnection): Promise<void> {
  return database.none('CALL trunc_data()');
}
