package it.unipd.dstack.butterfly.middleware.dispatcher.model;

import it.unipd.dstack.butterfly.consumer.avro.Contacts;
import java.util.Map;

public class UserManagerResponseData {
    private String firstname;
    private String lastname;
    private Map<Contacts, String> contacts;

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public Map<Contacts, String> getContacts() {
        return contacts;
    }
}
