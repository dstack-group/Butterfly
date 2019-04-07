package it.unipd.dstack.butterfly.jsonconverter;

public class JSONConverterException extends RuntimeException {
    public JSONConverterException(RuntimeException e) {
        super(e);
    }
}