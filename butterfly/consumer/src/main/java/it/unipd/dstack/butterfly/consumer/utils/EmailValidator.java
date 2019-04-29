/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  EmailValidator.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.utils;

public class EmailValidator {
    private EmailValidator() {}

    public static boolean isValidEmailAddress(String emailAddress) {
        var regex = "^(.+)@(.+)[.](.+)$";
        return emailAddress.matches(regex);
    }
}
