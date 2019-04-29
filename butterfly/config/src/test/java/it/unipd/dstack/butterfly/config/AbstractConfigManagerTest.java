/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    config
 * @fileName:  AbstractConfigManagerTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.config;

import it.unipd.dstack.butterfly.config.exception.ConfigurationCastException;
import it.unipd.dstack.butterfly.config.exception.ConfigurationUndefinedException;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class AbstractConfigManagerTest {
    private class TestConfigManager extends AbstractConfigManager {
        private Map<String, String> configMap = new HashMap<>();

        @Override
        protected String readConfigValue(String property) {
            return this.configMap.get(property);
        }

        public void setProperty(String property, String value) {
            this.configMap.put(property, value);
        }
    }

    TestConfigManager configManager = new TestConfigManager();

    @Test
    public void canReadStringValues() {
        final String SERVICE_NAME_KEY = "SERVICE_NAME";
        final String DATABASE_NAME_KEY = "DATABASE_NAME";

        configManager.setProperty(SERVICE_NAME_KEY, "user-manager");
        configManager.setProperty(DATABASE_NAME_KEY, "butterfly");

        assertEquals("user-manager", configManager.getStringProperty(SERVICE_NAME_KEY));
        assertEquals("butterfly", configManager.getStringProperty(DATABASE_NAME_KEY));
    }

    @Test
    public void canReadBooleanValues() {
        final String ENABLE_CACHE_KEY = "ENABLE_CACHE";
        final String ENABLE_HTTPS_KEY = "ENABLE_HTTPS";

        configManager.setProperty(ENABLE_CACHE_KEY, "true");
        configManager.setProperty(ENABLE_HTTPS_KEY, "false");

        assertEquals(true, configManager.getBooleanProperty(ENABLE_CACHE_KEY));
        assertEquals(false, configManager.getBooleanProperty(ENABLE_HTTPS_KEY));
    }

    @Test
    public void canReadIntegerValues() {
        final String SERVER_PORT_KEY = "SERVER_PORT";
        final String DATABASE_PORT_KEY = "DATABASE_PORT";

        configManager.setProperty(SERVER_PORT_KEY, "5000");
        configManager.setProperty(DATABASE_PORT_KEY, "5432");

        assertEquals((Integer) 5000, configManager.getIntProperty(SERVER_PORT_KEY));
        assertEquals((Integer) 5432, configManager.getIntProperty(DATABASE_PORT_KEY));
    }

    @Test
    public void shouldThrowConfigurationCastExceptionIfValueIsntCastableToDestinationType() {
        final String SERVICE_NAME_KEY = "SERVICE_NAME";
        final String ENABLE_CACHE_KEY = "ENABLE_CACHE";
        final String SERVER_PORT_KEY = "SERVER_PORT";

        configManager.setProperty(SERVICE_NAME_KEY, "user-manager");
        configManager.setProperty(ENABLE_CACHE_KEY, "true");
        configManager.setProperty(SERVER_PORT_KEY, "5000");

        // should not throw when the destination type is String
        configManager.getStringProperty(SERVICE_NAME_KEY);
        configManager.getStringProperty(ENABLE_CACHE_KEY);
        configManager.getStringProperty(SERVER_PORT_KEY);

        assertThrows(ConfigurationCastException.class, () -> {
            configManager.getBooleanProperty(SERVICE_NAME_KEY);
        });

        assertThrows(ConfigurationCastException.class, () -> {
            configManager.getBooleanProperty(SERVICE_NAME_KEY, false);
        });

        assertThrows(ConfigurationCastException.class, () -> {
            configManager.getIntProperty(SERVICE_NAME_KEY);
        });

        assertThrows(ConfigurationCastException.class, () -> {
            configManager.getIntProperty(SERVICE_NAME_KEY, 5432);
        });
    }

    @Test
    public void shouldThrowConfigurationUndefinedExceptionIfValueIsntCastableToDestinationType() {
        final String SERVICE_NAME_KEY = "SERVICE_NAME";
        final String DATABASE_NAME_KEY = "DATABASE_NAME";
        final String ENABLE_CACHE_KEY = "ENABLE_CACHE";
        final String ENABLE_HTTPS_KEY = "ENABLE_HTTPS";
        final String SERVER_PORT_KEY = "SERVER_PORT";
        final String DATABASE_PORT_KEY = "DATABASE_PORT";

        // should not throw when the default property is set
        configManager.getStringProperty(SERVICE_NAME_KEY, "user-manager");
        configManager.getBooleanProperty(ENABLE_CACHE_KEY, true);
        configManager.getIntProperty(SERVER_PORT_KEY, 5000);

        assertThrows(ConfigurationUndefinedException.class, () -> {
            configManager.getStringProperty(DATABASE_NAME_KEY);
        });

        assertThrows(ConfigurationUndefinedException.class, () -> {
            configManager.getBooleanProperty(ENABLE_HTTPS_KEY);
        });

        assertThrows(ConfigurationUndefinedException.class, () -> {
            configManager.getIntProperty(DATABASE_PORT_KEY);
        });
    }

    @Test
    public void shouldReturnDefaultValuesOnlyIfTheSpecifiedPropertyDoesntExist() {
        final String SERVICE_NAME_KEY = "SERVICE_NAME";
        final String DATABASE_NAME_KEY = "DATABASE_NAME";
        final String ENABLE_CACHE_KEY = "ENABLE_CACHE";
        final String ENABLE_HTTPS_KEY = "ENABLE_HTTPS";
        final String SERVER_PORT_KEY = "SERVER_PORT";
        final String DATABASE_PORT_KEY = "DATABASE_PORT";

        configManager.setProperty(SERVICE_NAME_KEY, "user-manager");
        configManager.setProperty(ENABLE_CACHE_KEY, "true");
        configManager.setProperty(SERVER_PORT_KEY, "5000");

        assertEquals("user-manager", configManager.getStringProperty(SERVICE_NAME_KEY, "another-service"));
        assertEquals("butterfly", configManager.getStringProperty(DATABASE_NAME_KEY, "butterfly"));

        assertEquals(true, configManager.getBooleanProperty(ENABLE_CACHE_KEY, false));
        assertEquals(false, configManager.getBooleanProperty(ENABLE_HTTPS_KEY, false));

        assertEquals((Integer) 5000, configManager.getIntProperty(SERVER_PORT_KEY, 1000));
        assertEquals((Integer) 5432, configManager.getIntProperty(DATABASE_PORT_KEY, 5432));
    }
}
