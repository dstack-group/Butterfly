package it.unipd.dstack.butterfly.config;

/**
 * EnvironmentConfigManager gives the user the possibility to read configuration properties among the environment
 * variables, setting default values and explicitly cast them to the following types:
 * - String;
 * - Integer;
 * - Boolean;
 * In case of errors, an instance of <code>ConfigurationException</code> is thrown.
 */
public class EnvironmentConfigManager extends AbstractConfigManager {
    public EnvironmentConfigManager() {
        super();
    }

    /**
     * Reads a value from a configuration resource.
     *
     * @param property
     * @return
     */
    @Override
    protected String readConfigValue(String property) {
        return System.getenv(property);
    }
}
