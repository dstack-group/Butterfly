package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class User {
    private long id;
    private String login;
    private String email;
    private String firstname;
    private String lastname;

    public long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }
}
