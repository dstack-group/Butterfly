/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  SMTPEmailConfig.java
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

import java.util.Objects;

public class SMTPEmailConfig implements EmailConfig {
    private final String host;
    private final Integer port;
    private final String username;
    private final String password;
    private final Integer sessionTimeoutMS;
    private final Boolean isDebugEnabled;

    private SMTPEmailConfig(
            String host,
            Integer port,
            String username,
            String password,
            Integer sessionTimeoutMS,
            Boolean isDebugEnabled
    ) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.sessionTimeoutMS = sessionTimeoutMS;
        this.isDebugEnabled = isDebugEnabled;
    }

    /**
     * @return the email host address.
     */
    @Override
    public String getHost() {
        return this.host;
    }

    /**
     * @return the email host port.
     */
    @Override
    public Integer getPort() {
        return this.port;
    }

    /**
     * @return the username for the current mail session.
     */
    @Override
    public String getUsername() {
        return this.username;
    }

    /**
     * @return the password for the current mail session, relative to the current username.
     */
    @Override
    public String getPassword() {
        return this.password;
    }

    /**
     * @return the amount of time in milliseconds after which a mail session is considered expired.
     */
    @Override
    public Integer getSessionTimeoutMS() {
        return this.sessionTimeoutMS;
    }

    /**
     * @return true if and only if debug stacktraces should be shown.
     */
    @Override
    public Boolean isDebugEnabled() {
        return this.isDebugEnabled;
    }

    public static class Builder {
        private String host;
        private Integer port = 587;
        private String username;
        private String password;
        private Integer sessionTimeoutMS = 5000;
        private Boolean isDebugEnabled = true;

        public Builder setHost(String host) {
            this.host = host;
            return this;
        }

        public Builder setPort(Integer port) {
            this.port = port;
            return this;
        }

        public Builder setUsername(String username) {
            this.username = username;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder setSessionTimeoutMS(Integer sessionTimeoutMS) {
            this.sessionTimeoutMS = sessionTimeoutMS;
            return this;
        }

        public Builder setDebugEnabled(Boolean debugEnabled) {
            isDebugEnabled = debugEnabled;
            return this;
        }

        public SMTPEmailConfig build() {
            Objects.nonNull(this.host);
            return new SMTPEmailConfig(
                    host,
                    port,
                    username,
                    password,
                    sessionTimeoutMS,
                    isDebugEnabled
            );
        }
    }
}
