/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  UserManagerResponseData.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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

    /**
     * Setters are for testability purposes only.
     */

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setContacts(Map<Contacts, String> contacts) {
        this.contacts = contacts;
    }
}
