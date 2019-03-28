package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

public class HttpRequestUtils {
    /**
     * Reads the POST data from a request into a String and returns it.
     *
     * @param request the HTTP request containing the POST data
     * @return the POST data as a String instance
     * @throws IOException if any error occurs while reading the POST data
     */
    public static String getPostDataAsString(HttpServletRequest request) throws IOException {

        try (InputStreamReader reader = new InputStreamReader(request.getInputStream(), "UTF-8")) {
            return (getReaderContentAsString(reader));
        }
    }

    /**
     * Reads the content of a Reader instance and returns it as a String.
     *
     * @param reader the Reader instance to read the data from
     * @return the content of a Reader instance as a String
     * @throws IOException if any error occurs while reading the POST data
     */
    public static String getReaderContentAsString(Reader reader) throws IOException {

        int count;
        final char[] buffer = new char[2048];
        final StringBuilder out = new StringBuilder();
        while ((count = reader.read(buffer, 0, buffer.length)) >= 0) {
            out.append(buffer, 0, count);
        }

        return (out.toString());
    }
}
