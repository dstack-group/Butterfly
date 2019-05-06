/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    json-converter
 * @fileName:  JSONConverterException.java
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

public class JSONConverterException extends RuntimeException {
    public JSONConverterException(RuntimeException e) {
        super(e);
    }
}