package it.unipd.dstack.butterfly.common.config;

/**
 * ConfigManager defines the contract for reading configuration properties, setting default values and explicitly
 * cast them to the following types:
 * - String;
 * - Integer;
 * - Boolean;
 * In case of errors, an instance of <code>ConfigurationException</code> is thrown.
 */
public interface ConfigManager {
    /**
     * Returns the value of the configuration variable specified by <code>property</code>.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    String getStringProperty(String property) throws ConfigurationUndefinedException;

    /**
     * Returns the value of the configuration variable specified by <code>property</code>, or the value specified by
     * <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    String getStringProperty(String property, String defaultProperty) throws ConfigurationUndefinedException;

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Boolean.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Boolean, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    Boolean getBooleanProperty(String property) throws ConfigurationException;

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Boolean, or the
     * value specified by <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Boolean, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    Boolean getBooleanProperty(String property, Boolean defaultProperty) throws ConfigurationException;

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Integer.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Integer, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    Integer getIntProperty(String property) throws ConfigurationException;

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Integer, or the
     * value specified by <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Integer, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    Integer getIntProperty(String property, Integer defaultProperty) throws ConfigurationException;
}
