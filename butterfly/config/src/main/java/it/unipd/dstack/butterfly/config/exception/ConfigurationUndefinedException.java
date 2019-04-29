/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    config
 * @fileName:  ConfigurationUndefinedException.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * ConfigurationUndefinedException is the exception thrown by AbstractConfigManager implementations when the
 * user attempts to read an undefined configuration property without providing a default value to return.
 */

package it.unipd.dstack.butterfly.config.exception;

public class ConfigurationUndefinedException extends ConfigurationException {
    public ConfigurationUndefinedException(String property) {
        super(ConfigurationUndefinedException.getMessage(property));
    }

    private static String getMessage(String property) {
        return String.format("The property %s is null, but it should have at least a default value.", property);
    }
}
