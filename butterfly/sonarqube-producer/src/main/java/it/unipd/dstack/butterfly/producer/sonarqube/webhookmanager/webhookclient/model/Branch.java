/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  Branch.java
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.model;

public class Branch {
    private String name;
    private String type;
    private Boolean isMain;
    private String url;

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Boolean getIsMain() {
        return isMain;
    }

    public String getUrl() {
        return url;
    }
}
