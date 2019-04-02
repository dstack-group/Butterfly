/**
 * ConfigManager defines the contract for reading configuration properties, setting default values and explicitly
 * cast them to the following types:
 * - String;
 * - Integer;
 * - Boolean;
 * In case of errors, an instance of ConfigurationException is thrown.
 */
export interface ConfigManager {

  /**
   *  Returns the value of the configuration variable specified by `property`, or the value specified by
   * `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getStringProperty(property: string, defaultProperty?: string): string;

  /**
   *  Returns the value of the configuration variable specified by `property` casted to boolean, or the
   * value specified by `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   * If the value of <code>property</code> cannot be casted to boolean, an instance of
   * <code>ConfigurationCastException</code> is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getBooleanProperty(property: string, defaultProperty?: boolean): boolean;

  /**
   *  Returns the value of the configuration variable specified by `property` casted to integer, or the
   * value specified by `defaultProperty` if `property` isn't set.
   * If the configuration variable identified by `property` isn't set and `defaultProperty` is null,
   * an instance of `ConfigurationUndefinedException` is thrown.
   * If the value of <code>property</code> cannot be casted to integer, an instance of
   * <code>ConfigurationCastException</code> is thrown.
   *
   * @param property property the configuration property name.
   * @param defaultProperty the default value returned if the configuration identified by `property` isn't set.
   */
  getIntProperty(property: string, defaultProperty?: number): number;
}
