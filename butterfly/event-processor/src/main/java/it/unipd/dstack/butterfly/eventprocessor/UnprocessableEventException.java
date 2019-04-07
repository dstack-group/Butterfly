package it.unipd.dstack.butterfly.eventprocessor;

public class UnprocessableEventException extends RuntimeException {
    public UnprocessableEventException(RuntimeException e) {
        super(UnprocessableEventException.buildMessage(e));
    }

    private static String buildMessage(RuntimeException e) {
        return String.format("Cannot process event due to exception: %s", e.getMessage());
    }
}