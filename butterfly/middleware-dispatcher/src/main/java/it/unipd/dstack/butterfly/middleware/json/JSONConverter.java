package it.unipd.dstack.butterfly.middleware.json;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

public class JSONConverter {
    private Gson gson;

    public JSONConverter() {
        this(true);
    }

    public JSONConverter(boolean lowerCaseWithUnderScore) {
        var fieldNamingPolicy = lowerCaseWithUnderScore ?
                FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES :
                FieldNamingPolicy.IDENTITY;

        this.gson = new GsonBuilder()
                .setFieldNamingPolicy(fieldNamingPolicy)
                .serializeNulls()
                .create();
    }

    public <T> T fromJson(String json, Class<T> klass) throws JsonSyntaxException {
        try {
            return this.gson.fromJson(json, klass);
        } catch (JsonSyntaxException e) {
            throw new JSONConverterException(e);
        }
    }
}
