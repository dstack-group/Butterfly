/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  Condition.java
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

public class Condition {
    private String metric;
    private String operator;
    private String value;
    private String status;
    private String errorThreshold;

    public String getMetric() {
        return metric;
    }

    public String getOperator() {
        return operator;
    }
    
    public Double getValue() {
        return Double.valueOf(value);
    }
    
    public String getStatus() {
        return status;
    }

    public Integer getErrorThreshold() {
        return Integer.valueOf(errorThreshold);
    }
}
