package it.unipd.dstack.butterfly.consumer.utils;

public class EmailValidator {
    private EmailValidator() {}

    public static boolean isValidEmailAddress(String emailAddress) {
        var regex = "^(.+)@(.+)[.](.+)$";
        return emailAddress.matches(regex);
    }
}
