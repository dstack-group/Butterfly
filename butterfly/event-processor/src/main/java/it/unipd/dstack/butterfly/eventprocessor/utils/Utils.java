package it.unipd.dstack.butterfly.eventprocessor.utils;

import org.apache.avro.specific.SpecificRecord;

public class Utils {
    private Utils() {}

    /**
     * Given an Avro record, it returns its JSON representation encoded as a String.
     *
     * @param avroRecord The Avro record to be converted to JSON
     * @param <T>        The type of avroRecord
     * @return JSON version of avroRecord
     */
    public static <T extends SpecificRecord> String getJSONFromAvro(T avroRecord) {
        return avroRecord.toString();
    }
}