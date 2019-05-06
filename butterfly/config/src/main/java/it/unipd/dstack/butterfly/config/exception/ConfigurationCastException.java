/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    config
 * @fileName:  ConfigurationCastException.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * ConfigurationCastException is the exception thrown by AbstractConfigManager implementations when an illegal
 * type cast is attempted.
 */

package it.unipd.dstack.butterfly.config.exception;

public class ConfigurationCastException extends ConfigurationException {
    public ConfigurationCastException(String property, String value, Class<?> type) {
        super(ConfigurationCastException.getMessage(property, value, type));
    }

    private static String getMessage(String property, String value, Class<?> type) {
        return String.format("Cannot cast the property %s of value %s to type %s.", property, value, type);
    }
}
