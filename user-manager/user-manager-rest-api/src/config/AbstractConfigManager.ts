import { ConfigurationCastException } from './errors/ConfigurationCastException';
import { ConfigurationUndefinedException } from './errors/ConfigurationUndefinedException';

export abstract class AbstractConfigManager {
  /**
   * Reads a value from a configuration resource.
   * @param property the configuration property name.
   * @return the configuration value corresponding to the given property.
   */
  protected abstract readConfigValue(property: string): string | undefined;

  /**
   * Returns the value of the configuration variable specified by `property`, or the value specified by
   * `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getStringProperty(property: string, defaultProperty?: string): string {
    return this.getConfigValue(property, defaultProperty, AbstractConfigManager.stringToStringMapper, 'string');
  }

  /**
   * Returns the value of the configuration variable specified by `property` casted to boolean, or the
   * value specified by `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   * If the value of <code>property</code> cannot be casted to boolean, an instance of
   * <code>ConfigurationCastException</code> is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getBooleanProperty(property: string, defaultProperty?: boolean): boolean {
    return this.getConfigValue(property, defaultProperty, AbstractConfigManager.stringToBooleanMapper, 'boolean');
  }

  /**
   * Returns the value of the configuration variable specified by `property` casted to integer, or the
   * value specified by `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   * If the value of <code>property</code> cannot be casted to integer, an instance of
   * <code>ConfigurationCastException</code> is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getIntProperty(property: string, defaultProperty?: number): number {
    return this.getConfigValue(property, defaultProperty, AbstractConfigManager.stringToIntegerMapper, 'number');
  }

  /**
   * If both the environment variable identified by `property` and `defaultProperty` do not exist,
   * it throws `ConfigurationError`.
   * @param property
   * @param defaultProperty
   * @param mapper
   */
  private getConfigValue<T>(
    property: string,
    defaultProperty: T,
    mapper: (value: string) => NonNullable<T>,
    type: string,
  ): NonNullable<T> {
    const propertyValue = this.readConfigValue(property);
    if (propertyValue == null) {
      if (defaultProperty == null) {
        throw new ConfigurationUndefinedException(property);
      } else {
        // if the variable isn't set but at least there's a default value
        return defaultProperty!;
      }
    } else {
      // if the variable is set, try to cast it
      try {
        return mapper(propertyValue);
      } catch (_) {
        throw new ConfigurationCastException(property, propertyValue, type);
      }
    }
  }

  /**
   * stringToStringMapper returns an identity.
   */
  private static stringToStringMapper(value: string): string {
    return value;
  }

  /**
   * stringToBooleanMapper attempts to casts a String value to Boolean.
   */
  private static stringToBooleanMapper(value: string): boolean {
    const valueLowerCase = value.toLowerCase();
    if (valueLowerCase === 'true') {
      return true;
    } else if (valueLowerCase === 'false') {
      return false;
    } else {
      throw new TypeError();
    }
  }

  /**
   * stringToIntegerMapper attempts to cast a String value to Integer.
   */
  private static stringToIntegerMapper(value: string): number {
    const result = Number.parseInt(value, 10);
    if (Number.isNaN(result)) {
      throw new TypeError();
    }
    return result;
  }
}
