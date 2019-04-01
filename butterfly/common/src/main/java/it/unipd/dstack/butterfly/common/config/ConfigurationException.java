package it.unipd.dstack.butterfly.common.config;

public abstract class ConfigurationException extends RuntimeException {
    public ConfigurationException(String message) {
        super(message);
    }
}
