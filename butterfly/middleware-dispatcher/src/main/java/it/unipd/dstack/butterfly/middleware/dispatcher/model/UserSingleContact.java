/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  UserSingleContact.java
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

public class UserSingleContact extends User {
    private Contacts contact;
    private String contactRef;

    public UserSingleContact(User user) {
        super(user);
    }

    public Contacts getContact() {
        return contact;
    }

    public void setContact(Contacts contact) {
        this.contact = contact;
    }

    public String getContactRef() {
        return contactRef;
    }

    public void setContactRef(String contactRef) {
        this.contactRef = contactRef;
    }
}
