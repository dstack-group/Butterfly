package it.unipd.dstack.butterfly.consumer.utils;

import it.unipd.dstack.butterfly.consumer.utils.EmailValidator;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class EmailValidatorTest {

    /**
     *  <p>Check if the isValidEmailAddress method returns true when the input string has an email's format
     *  <code>user@domani.ext</code><p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldValidateEmailFormatString() {

        assertTrue(EmailValidator.isValidEmailAddress("dstackgroup@gmail.com"));
        assertFalse(EmailValidator.isValidEmailAddress("dstackgroup_AT_gmail.com"));

        // Testing with an empty string
        assertFalse(EmailValidator.isValidEmailAddress(""));
    }
}
