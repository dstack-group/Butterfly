/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    config
 * @fileName:  EnvironmentConfigManager.java
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
