package it.unipd.dstack.butterfly.middleware.json;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

public class JSONConverterImpl implements JSONConverter {
    private Gson gson;

    public JSONConverterImpl() {
        this(true);
    }

    public JSONConverterImpl(boolean lowerCaseWithUnderScore) {
        var fieldNamingPolicy = lowerCaseWithUnderScore ?
                FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES :
                FieldNamingPolicy.IDENTITY;

        this.gson = new GsonBuilder()
                .setFieldNamingPolicy(fieldNamingPolicy)
                .serializeNulls()
                .create();
    }

    /**
     * Given a String representation of a JSON value and a target Java class, returns a corresponding object.
     *
     * @param json  JSON value expressed as a String
     * @param klass the name of the class to instantiate given the json's value
     * @return an instance of klass representing a model of json
     * @throws JSONConverterException if json doesn't match with klass' definition
     */
    @Override
    public <T> T fromJson(String json, Class<T> klass) throws JSONConverterException {
        try {
            return this.gson.fromJson(json, klass);
        } catch (JsonSyntaxException e) {
            throw new JSONConverterException(e);
        }
    }
}
