package it.unipd.dstack.butterfly.config.exception;

public abstract class ConfigurationException extends RuntimeException {
    public ConfigurationException(String message) {
        super(message);
    }
}
