package it.unipd.dstack.butterfly.producer.gitlab.testutils;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;

import java.util.HashMap;
import java.util.Map;

public class TestConfigManager extends AbstractConfigManager {
    private Map<String, String> configMap = new HashMap<>();
    /**
     * Reads a value from a configuration resource.
     *
     * @param property
     * @return the configuration value corresponding to the given property.
     */
    @Override
    protected String readConfigValue(String property) {
        return this.configMap.get(property);
    }

    public void setProperty(String property, String value) {
        this.configMap.put(property, value);
    }
}
