/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  TestUtils.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * TestUtils contains common utilities for redmine-producer's unit tests.
 */

package it.unipd.dstack.butterfly.producer.redmine.testutils;

import org.springframework.mock.web.MockHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class TestUtils {
    public String readJSONFile(String filename) throws IOException {
        String fileAsString = this.getClass()
                .getClassLoader()
                .getResource(filename)
                .getFile();
        Path filePath = Paths.get(new File(fileAsString).getAbsolutePath());
        return Files.readString(filePath);
    }

    public HttpServletRequest prepareMockHTTPRequest(String jsonFilename) throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String payload = this.readJSONFile(jsonFilename);
        request.setContent(payload.getBytes());
        return request;
    }
}
