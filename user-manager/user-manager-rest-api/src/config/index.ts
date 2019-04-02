import { ConfigManager } from './ConfigManager';

export function getAppConfig(configManager: ConfigManager) {
  const NODE_ENV = configManager.getStringProperty('NODE_ENV', 'development');
  const APP_NAME = configManager.getStringProperty('APP_NAME');
  const APP_HOST = configManager.getStringProperty('APP_HOST');
  const APP_PORT = configManager.getIntProperty('APP_PORT');

  const configs = {
    base: {
      env: NODE_ENV,
      host: APP_HOST,
      name: APP_NAME,
      port: APP_PORT,
    },
  };

  return configs.base;
}
