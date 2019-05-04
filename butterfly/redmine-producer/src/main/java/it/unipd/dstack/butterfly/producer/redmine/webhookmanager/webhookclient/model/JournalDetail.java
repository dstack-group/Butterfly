/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  JournalDetail.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class JournalDetail {
    private long id;
    private String value;
    private String oldValue;
    private String propKey;
    private String property;

    public long getId() {
        return id;
    }

    public String getValue() {
        return value;
    }

    public String getOldValue() {
        return oldValue;
    }

    public String getPropKey() {
        return propKey;
    }

    public String getProperty() {
        return property;
    }
}
