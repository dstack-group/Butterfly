/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    json-converter
 * @fileName:  JSONConverter.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.jsonconverter;

import java.util.List;

public interface JSONConverter {
    /**
     * Given a String representation of a JSON value and a target Java class, returns a corresponding object.
     * @param json JSON value expressed as a String
     * @param klass the name of the class to instantiate given the json's value
     * @return an instance of klass representing a old_model of json
     * @throws JSONConverterException if json doesn't match with klass' definition
     */
    <T> T fromJson(String json, Class<T> klass) throws JSONConverterException;

    /**
     * Given a String representation of an array of JSON values and a target Java class, returns a corresponding
     * list of objects.
     * @param json
     * @param klass
     * @param <T>
     * @return
     * @throws JSONConverterException
     */
    <T> List<T> fromJsonArray(String json, Class<T> klass) throws JSONConverterException;
}
