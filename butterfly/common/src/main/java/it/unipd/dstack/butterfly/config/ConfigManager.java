package it.unipd.dstack.butterfly.config;

import java.util.Optional;
import java.util.function.Function;

public final class ConfigManager {

    private static Function<String, Boolean> stringToBooleanMapper = (String str) -> Boolean.valueOf(str);
    private static Function<String, Integer> stringToIntegerMapper = (String str) -> Integer.valueOf(str);

    private ConfigManager() {
    }

    /**
     * @param property
     * @return
     */
    public static String getStringProperty(String property) {
        return getEnv(property, null);
    }

    /**
     * @param property
     * @return
     */
    public static String getStringProperty(String property, String defaultProperty) {
        return getEnv(property, defaultProperty);
    }

    /**
     * @param property
     * @return
     */
    public static boolean getBooleanProperty(String property) {
        return getBooleanProperty(property, null);
    }

    /**
     * @param property
     * @param defaultProperty
     * @return
     */
    public static boolean getBooleanProperty(String property, Boolean defaultProperty) {
        return getEnv(property, defaultProperty, stringToBooleanMapper);
    }

    /**
     * @param property
     * @return
     */
    public static int getIntProperty(String property) {
        return getIntProperty(property, null);
    }

    /**
     * @param property
     * @param defaultProperty
     * @return
     */
    public static int getIntProperty(String property, Integer defaultProperty) {
        return getEnv(property, defaultProperty, stringToIntegerMapper);
    }

    /**
     * Returns the value of the environment variable specified by <code>property</code>. If it's not set, it returns
     * <code>defaultProperty</code>.
     *
     * @param property        the name of the environment variable
     * @param defaultProperty the value to be returned if <code>property</code> is not defined in the system environment
     * @return the string value of the variable, or <code>defaultProperty</code> if the variable is not defined in the
     * system environment, or <code>null</code> if <code>defaultProperty</code> is null.
     */
    private static String getEnv(String property, String defaultProperty) {
        return getEnv(property, defaultProperty, Function.identity());
    }

    /**
     * Returns the value of the environment variable specified by <code>property</code>. If it's not set, it returns
     * <code>defaultProperty</code> with type <code>T</code>.
     *
     * @param <T>             The type of the result of the mapping function
     * @param property        the name of the environment variable
     * @param defaultProperty the value to be returned if <code>property</code> is not defined in the system environment
     * @param mapper          function used to cast a variable to the desired type <code>T</code>
     * @return the value of the variable casted to type <code>T</code>, or <code>defaultProperty</code> if the
     * variable is not defined in the system environment, or <code>null</code> if <code>defaultProperty</code> is null.
     * @throws NullPointerException if the mapping function is null
     */
    private static <T> T getEnv(String property, T defaultProperty, Function<String, T> mapper) {
        return Optional.ofNullable(System.getenv(property))
                .map(mapper)
                .orElse(defaultProperty);
    }
}
