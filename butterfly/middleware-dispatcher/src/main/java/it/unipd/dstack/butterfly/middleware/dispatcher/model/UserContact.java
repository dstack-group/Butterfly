package it.unipd.dstack.butterfly.middleware.dispatcher.model;

import it.unipd.dstack.butterfly.consumer.avro.Contacts;

import java.util.Map;

public class UserContact extends User {
    private Map<Contacts, String> contactInfo;

    public Map<Contacts, String> getContactInfo() {
        return contactInfo;
    }
}
