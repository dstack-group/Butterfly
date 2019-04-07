package it.unipd.dstack.butterfly.config;

import it.unipd.dstack.butterfly.config.exception.ConfigurationCastException;
import it.unipd.dstack.butterfly.config.exception.ConfigurationException;
import it.unipd.dstack.butterfly.config.exception.ConfigurationUndefinedException;

import java.util.Optional;
import java.util.function.Function;

/**
 * AbstractConfigManager is an abstract class that defines the contract for reading configuration properties,
 * setting default values and explicitly cast them to the following types:
 * - String;
 * - Integer;
 * - Boolean;
 * It implements the Template Pattern via the readConfigValue method.
 * In case of errors, an instance of <code>ConfigurationException</code> is thrown.
 */
public abstract class AbstractConfigManager {
    /**
     * Reads a value from a configuration resource.
     * @param property
     * @return the configuration value corresponding to the given property.
     */
    protected abstract String readConfigValue(String property);

    /**
     * Returns the value of the configuration variable specified by <code>property</code>.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     *
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    public final String getStringProperty(String property) throws ConfigurationUndefinedException {
        return this.getStringProperty(property, null);
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code>, or the value specified by
     * <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     *
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    public final String getStringProperty(String property, String defaultProperty) throws ConfigurationUndefinedException {
        return this
                .getConfigValue(property, defaultProperty, AbstractConfigManager.stringToStringMapper, String.class);
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Boolean.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Boolean, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     *
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    public final Boolean getBooleanProperty(String property) throws ConfigurationException {
        return this.getBooleanProperty(property, null);
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Boolean, or the
     * value specified by <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Boolean, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     *
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    public final Boolean getBooleanProperty(String property, Boolean defaultProperty) throws ConfigurationException {
        return this
                .getConfigValue(property, defaultProperty, AbstractConfigManager.stringToBooleanMapper, Boolean.class);
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Integer.
     * If the configuration variable identified by <code>property</code> isn't set, an instance of
     * <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Integer, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     *
     * @param property the configuration property name
     * @return the value of the specified configuration variable.
     */
    public final Integer getIntProperty(String property) throws ConfigurationException {
        return this.getIntProperty(property, null);
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted to Integer, or the
     * value specified by <code>defaultProperty</code> if <code>property</code> isn't set.
     * If the configuration variable identified by <code>property</code> isn't set and defaultProperty is null,
     * an instance of <code>ConfigurationUndefinedException</code> is thrown.
     * If the value of <code>property</code> cannot be casted to Integer, an instance of
     * <code>ConfigurationCastException</code> is thrown.
     *
     * @param property
     * @param defaultProperty
     * @return the value of the specified configuration variable, or defaultProperty if it isn't set.
     */
    public final Integer getIntProperty(String property, Integer defaultProperty) throws ConfigurationException {
        return this
                .getConfigValue(property, defaultProperty, AbstractConfigManager.stringToIntegerMapper, Integer.class);
    }

    /**
     * Retrieves the value of the configuration identified by <code>property</code> wrapped in an Optional object.
     *
     * @param property the configuration property name
     * @return the optional configuration value
     */
    private Optional<String> getOptionalConfigValue(String property) {
        return Optional.ofNullable(this.readConfigValue(property));
    }

    /**
     * Returns the value of the configuration variable specified by <code>property</code> casted via the
     * <code>mapper</code> function, or the value specified by <code>defaultProperty</code> if <code>property</code>
     * isn't set.
     *
     * @param property        the name of the configuration variable to read.
     * @param defaultProperty the value to be returned if <code>property</code> is not defined.
     * @param mapper          function used to cast the value of the configuration property to the desired type
     *                        <code>T</code>.
     * @param type            class name of the destination type, only used in case ConfigurationCastException is
     *                        thrown.
     * @return the value of the variable casted to type <code>T</code>, or <code>defaultProperty</code> if the
     * variable is not defined in the system environment
     */
    private <T> T getConfigValue(String property, T defaultProperty, Function<String, T> mapper, Class<?> type) {
        Optional<String> propertyValue = this.getOptionalConfigValue(property);
        if (propertyValue.isEmpty()) {
            if (defaultProperty == null) {
                throw new ConfigurationUndefinedException(property);
            } else {
                // if the variable isn't set but at least there's a default value
                return defaultProperty;
            }
        } else {
            // if the variable is set, try to cast it
            try {
                return mapper.apply(propertyValue.get());
            } catch (ClassCastException | NumberFormatException e) {
                throw new ConfigurationCastException(property, propertyValue.get(), type);
            }
        }
    }

    /**
     * stringToStringMapper returns an identity.
     */
    private static Function<String, String> stringToStringMapper = Function.identity();

    /**
     * stringToBooleanMapper attempts to casts a String value to Boolean.
     */
    private static Function<String, Boolean> stringToBooleanMapper = (String value) -> Boolean.valueOf(value);

    /**
     * stringToIntegerMapper attempts to cast a String value to Integer.
     */
    private static Function<String, Integer> stringToIntegerMapper = (String value) -> Integer.valueOf(value);
}
