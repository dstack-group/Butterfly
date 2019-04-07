package it.unipd.dstack.butterfly.eventprocessor.json;

public class JSONConverterException extends RuntimeException {
    public JSONConverterException(RuntimeException e) {
        super(e);
    }
}