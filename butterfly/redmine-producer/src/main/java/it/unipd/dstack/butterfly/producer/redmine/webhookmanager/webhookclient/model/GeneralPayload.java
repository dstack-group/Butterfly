package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class GeneralPayload {
    private String action;
    private Issue issue;

    public boolean isNewIssue() {
        return this.action.equals("opened");
    }

    public boolean isUpdatedIssue() {
        return this.action.equals("updated");
    }

    public String getAction() {
        return action;
    }

    public Issue getIssue() {
        return issue;
    }
}
