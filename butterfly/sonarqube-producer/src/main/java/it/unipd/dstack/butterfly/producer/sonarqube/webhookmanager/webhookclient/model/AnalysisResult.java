/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  AnalysisResult.java
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
import java.sql.Date;
import java.util.List;

public class AnalysisResult {
    private String serverUrl;
    private String taskId;
    private String status;
    private Date analysedAt; // should be a timestamp
    private Date changedAt; // should be a timestamp
    private Project project;
    private Branch branch;
    private QualityGate qualityGate;

    public String getServerUrl() {
        return serverUrl;
    }
    
    public String getTaskId() {
        return taskId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public Date getAnalysedAt() {
        return analysedAt;
    }
    public Date getChangedAt() {
        return changedAt;
    }
    public Project getProject() {
        return project;
    }
    public Branch getBranch() {
        return branch;
    }
    public QualityGate getQualityGate() {
        return qualityGate;
    }

    public String getDescription() {
        List<Condition> conditions = qualityGate.getConditions();
        String description = "";
        for (Condition condition : conditions) {
            description += condition.getMetric() + ": " + condition.getStatus() + " ";
        }
        return description;
    }
}
