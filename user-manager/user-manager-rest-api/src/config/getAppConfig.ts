import { AbstractConfigManager } from './AbstractConfigManager';

export function getAppConfig(configManager: AbstractConfigManager) {
  const NODE_ENV = configManager.getStringProperty('NODE_ENV', 'development');
  const APP_NAME = configManager.getStringProperty('APP_NAME');
  const APP_HOST = configManager.getStringProperty('APP_HOST');
  const APP_PORT = configManager.getIntProperty('APP_PORT');

  return {
    env: NODE_ENV,
    host: APP_HOST,
    isProduction: NODE_ENV === 'production',
    name: APP_NAME,
    port: APP_PORT,
  };
}
