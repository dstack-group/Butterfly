import { ConfigurationUndefinedException } from '../../src/config/errors/ConfigurationUndefinedException';
import { ConfigurationCastException } from '../../src/config/errors/ConfigurationCastException';
import { TestConfigManager } from '../TestConfigManager';
import { EnvironmentConfigManager } from '../../src/config';

describe(`Config manager`, () => {
  let configManager: TestConfigManager;

  beforeEach(() => {
    configManager = new TestConfigManager();
  });

  it(`Can read string values`, () => {
    const SERVICE_NAME_KEY = 'SERVICE_NAME';
    const DATABASE_NAME_KEY = 'DATABASE_NAME';

    configManager.setProperty(SERVICE_NAME_KEY, 'user-manager');
    configManager.setProperty(DATABASE_NAME_KEY, 'butterfly');

    expect(configManager.getStringProperty(SERVICE_NAME_KEY)).toBe('user-manager');
    expect(configManager.getStringProperty(DATABASE_NAME_KEY)).toBe('butterfly');
  });

  it(`Can read boolean values`, () => {
    const ENABLE_CACHE_KEY = 'ENABLE_CACHE';
    const ENABLE_HTTPS_KEY = 'ENABLE_HTTPS';

    configManager.setProperty(ENABLE_CACHE_KEY, 'true');
    configManager.setProperty(ENABLE_HTTPS_KEY, 'false');

    expect(configManager.getBooleanProperty(ENABLE_CACHE_KEY)).toBe(true);
    expect(configManager.getBooleanProperty(ENABLE_HTTPS_KEY)).toBe(false);
  });

  it(`Can read integer values`, () => {
    const SERVER_PORT_KEY = 'SERVER_PORT';
    const DATABASE_PORT_KEY = 'DATABASE_PORT';

    configManager.setProperty(SERVER_PORT_KEY, '5000');
    configManager.setProperty(DATABASE_PORT_KEY, '5432');

    expect(configManager.getIntProperty(SERVER_PORT_KEY)).toBe(5000);
    expect(configManager.getIntProperty(DATABASE_PORT_KEY)).toBe(5432);
  });

  it(`Should throw ConfigurationCastException if the configuration value isn't castable
      to the destination type`, () => {
    const SERVICE_NAME_KEY = 'SERVICE_NAME';
    const ENABLE_CACHE_KEY = 'ENABLE_CACHE';
    const SERVER_PORT_KEY = 'SERVER_PORT';

    configManager.setProperty(SERVICE_NAME_KEY, 'user-manager');
    configManager.setProperty(ENABLE_CACHE_KEY, 'true');
    configManager.setProperty(SERVER_PORT_KEY, '5000');

    expect(() => {
      configManager.getStringProperty(SERVICE_NAME_KEY);
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getStringProperty(ENABLE_CACHE_KEY);
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getStringProperty(SERVER_PORT_KEY);
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getBooleanProperty(SERVICE_NAME_KEY);
    })
      .toThrow(new ConfigurationCastException(SERVICE_NAME_KEY, 'user-manager', 'boolean'));
    expect(() => {
      configManager.getBooleanProperty(SERVICE_NAME_KEY, false);
    })
      .toThrow(new ConfigurationCastException(SERVICE_NAME_KEY, 'user-manager', 'boolean'));
    expect(() => {
      configManager.getIntProperty(SERVICE_NAME_KEY);
    })
      .toThrow(new ConfigurationCastException(SERVICE_NAME_KEY, 'user-manager', 'number'));
    expect(() => {
      configManager.getIntProperty(SERVICE_NAME_KEY);
    })
      .toThrow(new ConfigurationCastException(SERVICE_NAME_KEY, 'user-manager', 'number'));
  });

  it(`Should throw ConfigurationUndefinedException if no configuration is found and
      if no default value is passed`, () => {
    const SERVICE_NAME_KEY = 'SERVICE_NAME';
    const DATABASE_NAME_KEY = 'DATABASE_NAME';
    const ENABLE_CACHE_KEY = 'ENABLE_CACHE';
    const ENABLE_HTTPS_KEY = 'ENABLE_HTTPS';
    const SERVER_PORT_KEY = 'SERVER_PORT';
    const DATABASE_PORT_KEY = 'DATABASE_PORT';

    expect(() => {
      configManager.getStringProperty(SERVICE_NAME_KEY, 'user-manager');
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getStringProperty(DATABASE_NAME_KEY);
    })
      .toThrow(new ConfigurationUndefinedException(DATABASE_NAME_KEY));
    expect(() => {
      configManager.getBooleanProperty(ENABLE_CACHE_KEY, true);
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getBooleanProperty(ENABLE_HTTPS_KEY);
    })
      .toThrow(new ConfigurationUndefinedException(ENABLE_HTTPS_KEY));
    expect(() => {
      configManager.getIntProperty(SERVER_PORT_KEY, 5000);
    })
      .not.toThrow(ConfigurationUndefinedException);
    expect(() => {
      configManager.getIntProperty(DATABASE_PORT_KEY);
    })
      .toThrow(new ConfigurationUndefinedException(DATABASE_PORT_KEY));
  });

  it(`Returns the default values only if the specified property doesn't exist`, () => {
    const SERVICE_NAME_KEY = 'SERVICE_NAME';
    const DATABASE_NAME_KEY = 'DATABASE_NAME';
    const ENABLE_CACHE_KEY = 'ENABLE_CACHE';
    const ENABLE_HTTPS_KEY = 'ENABLE_HTTPS';
    const SERVER_PORT_KEY = 'SERVER_PORT';
    const DATABASE_PORT_KEY = 'DATABASE_PORT';

    configManager.setProperty(SERVICE_NAME_KEY, 'user-manager');
    configManager.setProperty(ENABLE_CACHE_KEY, 'true');
    configManager.setProperty(SERVER_PORT_KEY, '5000');

    expect(configManager.getStringProperty(SERVICE_NAME_KEY, 'another-service')).toBe('user-manager');
    expect(configManager.getStringProperty(DATABASE_NAME_KEY, 'butterfly')).toBe('butterfly');
    expect(configManager.getBooleanProperty(ENABLE_CACHE_KEY, false)).toBe(true);
    expect(configManager.getBooleanProperty(ENABLE_HTTPS_KEY, false)).toBe(false);
    expect(configManager.getIntProperty(SERVER_PORT_KEY, 1000)).toBe(5000);
    expect(configManager.getIntProperty(DATABASE_PORT_KEY, 5432)).toBe(5432);
  });

  it(`EnvironmentConfigManager reads from process.env`, () => {
    const configManager = new EnvironmentConfigManager();
    expect(configManager.getStringProperty('NODE_ENV', 'test'));
  });
});
