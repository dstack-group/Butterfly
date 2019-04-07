package it.unipd.dstack.butterfly.config.exception;

public class ConfigurationUndefinedException extends ConfigurationException {
    public ConfigurationUndefinedException(String property) {
        super(ConfigurationUndefinedException.getMessage(property));
    }

    private static String getMessage(String property) {
        return String.format("The property %s is null, but it should have at least a default value.", property);
    }
}
