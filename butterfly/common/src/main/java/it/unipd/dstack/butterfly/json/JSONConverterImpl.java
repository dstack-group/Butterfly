package it.unipd.dstack.butterfly.json;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

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

    /**
     * Given a String representation of an array of JSON values and a target Java class, returns a corresponding
     * list of objects.
     *
     * @param json
     * @param klass
     * @return
     * @throws JSONConverterException
     */
    @Override
    public <T> List<T> fromJsonArray(String json, Class<T> klass) throws JSONConverterException {
        try {
            JsonList<T> jsonList = new JsonList<>(klass);
            return this.gson.fromJson(json, jsonList);
        } catch (JsonSyntaxException e) {
            throw new JSONConverterException(e);
        }
    }

    /**
     * Utility method that uses Java's reflection API to be able to obtain a List of the given type from the JSON string
     * that gson should parse.
     * @param <T>
     */
    private class JsonList<T> implements ParameterizedType {
        private Class<?> klass;

        public JsonList(Class<T> klass) {
            this.klass = klass;
        }

        @Override
        public Type[] getActualTypeArguments()
        {
            return new Type[] { klass };
        }

        @Override
        public Type getRawType()
        {
            return List.class;
        }

        @Override
        public Type getOwnerType()
        {
            return null;
        }
    }
}
