package it.unipd.dstack.butterfly.middleware.dispatcher.model;

public class User {
    protected String email;
    protected String firstname;
    protected String lastname;

    public User() {
    }

    public User(User u) {
        this.email = u.email;
        this.firstname = u.firstname;
        this.lastname = u.lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
}
