/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  QualityGate.java
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
import  java.util.List;

public class QualityGate {
    private String name;
    private String status;
    List<Condition> conditions;

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }
    
    public List<Condition> getConditions() {
        return conditions;
    }
}
