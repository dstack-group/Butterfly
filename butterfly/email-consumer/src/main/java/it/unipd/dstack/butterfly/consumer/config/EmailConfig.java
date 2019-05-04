/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  EmailConfig.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.config;

public interface EmailConfig {
    /**
     * @return the email host address.
     */
    String getHost();

    /**
     * @return the email host port.
     */
    Integer getPort();

    /**
     * @return the username for the current mail session.
     */
    String getUsername();

    /**
     * @return the password for the current mail session, relative to the current username.
     */
    String getPassword();

    /**
     * @return the amount of time in milliseconds after which a mail session is considered expired.
     */
    Integer getSessionTimeoutMS();

    /**
     * @return true if and only if debug stacktraces should be shown.
     */
    Boolean isDebugEnabled();
}
