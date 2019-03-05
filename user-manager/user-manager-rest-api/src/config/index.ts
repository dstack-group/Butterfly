import ConfigManager from './ConfigManager';

const NODE_ENV = ConfigManager.getStringProperty('NODE_ENV', 'development');
const APP_NAME = ConfigManager.getStringProperty('APP_NAME');
const APP_HOST = ConfigManager.getStringProperty('APP_HOST');
const APP_PORT = ConfigManager.getIntProperty('APP_PORT');

const configs = {
  base: {
    env: NODE_ENV,
    host: APP_HOST,
    name: APP_NAME,
    port: APP_PORT,
  },
};

export const config = configs.base;
