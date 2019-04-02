import { DatabaseConfig } from '../database';
import { ConfigManager } from './ConfigManager';

export function getDatabaseConfig(configManager: ConfigManager): DatabaseConfig {
  const DATABASE_HOST = configManager.getStringProperty('DATABASE_HOST');
  const DATABASE_NAME = configManager.getStringProperty('DATABASE_NAME');
  const DATABASE_PASSWORD = configManager.getStringProperty('DATABASE_PASSWORD');
  const DATABASE_PORT = configManager.getIntProperty('DATABASE_PORT');
  const DATABASE_USER = configManager.getStringProperty('DATABASE_USER');

  return {
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    user: DATABASE_USER,
  };
}
