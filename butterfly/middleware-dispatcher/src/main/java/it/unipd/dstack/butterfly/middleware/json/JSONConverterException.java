package it.unipd.dstack.butterfly.middleware.json;

public class JSONConverterException extends RuntimeException {
    public JSONConverterException(RuntimeException e) {
        super(e);
    }
}
