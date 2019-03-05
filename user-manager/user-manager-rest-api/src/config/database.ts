import { DatabaseConfig } from '../database';
import ConfigManager from './ConfigManager';

const DATABASE_HOST = ConfigManager.getStringProperty('DATABASE_HOST');
const DATABASE_NAME = ConfigManager.getStringProperty('DATABASE_NAME');
const DATABASE_PASSWORD = ConfigManager.getStringProperty('DATABASE_PASSWORD');
const DATABASE_PORT = ConfigManager.getIntProperty('DATABASE_PORT');
const DATABASE_USER = ConfigManager.getStringProperty('DATABASE_USER');

export const databaseConfig: DatabaseConfig = {
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  password: DATABASE_PASSWORD,
  port: DATABASE_PORT,
  user: DATABASE_USER,
};
