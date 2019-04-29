/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    config
 * @fileName:  ConfigurationException.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.config.exception;

public abstract class ConfigurationException extends RuntimeException {
    public ConfigurationException(String message) {
        super(message);
    }
}
