import { ConfigurationError } from './errors/ConfigurationError';
import { ConfigurationCastError } from './errors/ConfigurationCastError';

/**
 * Given a type T, it returns the same type excluding the cases in which it could be considered empty.
 */
type NonNullable<T> = T extends (null | undefined) ? never : T;

/**
 * Utility class to handle configuration from environment variables and provide explicit type casts.
 */
export default class ConfigManager {
  private ConfigManager() {
    // empty constructor to prevent subclassing
  }

  static getStringProperty(property: string, defaultProperty?: string) {
    return ConfigManager.getEnv(property, defaultProperty, ConfigManager.identity);
  }

  static getBooleanProperty(property: string, defaultProperty?: boolean) {
    return ConfigManager.getEnv(property, defaultProperty, ConfigManager.stringToBooleanMapper);
  }

  static getIntProperty(property: string, defaultProperty?: number) {
    return ConfigManager.getEnv(property, defaultProperty, ConfigManager.stringToIntegerMapper);
  }

  /**
   * Returns an environment variable specified by `property`. If it doesn't exist,
   * undefined is returned.
   * @param property
   */
  private static getOptionalEnv(property: string): string | undefined {
    return process.env[property];
  }

  /**
   * If both the environment variable identified by `property` and `defaultProperty` do not exist,
   * it throws `ConfigurationError`.
   * @param property
   * @param defaultProperty
   * @param mapper
   */
  private static getEnv<T>(
    property: string,
    defaultProperty: T,
    mapper: (value: string) => NonNullable<T>,
  ): NonNullable<T> {
    const envProperty = ConfigManager.getOptionalEnv(property);
    if (envProperty != null) {
      return mapper(envProperty);
    } else {
      if (defaultProperty) {
        return defaultProperty!;
      } else {
        throw new ConfigurationError(property);
      }
    }
  }

  private static identity(k: string): string {
    return k;
  }

  private static stringToBooleanMapper(str: string): boolean {
    if (str.toLowerCase() === 'true') {
      return true;
    } else {
      return false;
    }
  }

  private static stringToIntegerMapper(str: string): number {
    try {
      return Number.parseInt(str, 10);
    } catch (err) {
      throw new ConfigurationCastError(str, 'integer');
    }
  }
}
