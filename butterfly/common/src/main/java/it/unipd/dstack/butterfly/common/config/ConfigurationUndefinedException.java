package it.unipd.dstack.butterfly.common.config;

public class ConfigurationUndefinedException extends RuntimeException {
    public ConfigurationUndefinedException(String property) {
        super(ConfigurationUndefinedException.getMessage(property));
    }

    private static String getMessage(String property) {
        return String.format("The property %s is null, but it should have at least a default value", property);
    }
}
