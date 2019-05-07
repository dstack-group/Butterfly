/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookManagerTest.java
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * SonarqubeWebhookManagerTest tests that, given a mocked HTTP request, the correct events are emitted from
 * the SonarqubeWebhookManager class. The JSON payloads for the HTTP requests are read from the test/resources folder.
 */

package it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.sonarqube.testutils.TestUtils;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.stubbing.Answer;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.Services;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SonarqubeWebhookManagerTest {
    @Mock
    private SonarqubeWebhookListener<Event> sonarqubeWebhookListener;

    public SonarqubeWebhookManagerTest() {
        MockitoAnnotations.initMocks(this);
    }

    private TestUtils testUtils = new TestUtils();

    @Test
    public void shouldParseAnalysisCompletedEventFromHTTPRequest() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("SONARQUBE_PROJECT_ANALYSIS_COMPLETED.json");

        SonarqubeWebhookManager sonarqubeWebhookManager =
                new SonarqubeWebhookManager(sonarqubeWebhookListener);

        doAnswer((Answer<Void>) invocation -> {
            Event event = invocation.getArgument(0);
            assertEquals(ServiceEventTypes.SONARQUBE_PROJECT_ANALYSIS_COMPLETED, event.getEventType());
            assertEquals(Services.SONARQUBE, event.getService());
            assertEquals("SUCCESS", event.getTitle());
            assertEquals("new_maintainability_rating: OK new_coverage: ERROR new_duplicated_lines_density: OK new_security_rating: OK new_reliability_rating: OK", event.getDescription());
            assertEquals("AWpMVIXi300Bl9GYiThJ", event.getEventId());
            assertEquals("Butterfly", event.getProjectName());
            assertEquals("http://localhost:9000/dashboard?id=it.unipd.dstack.butterfly%3Abutterfly", event.getProjectURL());
            assertEquals(null, event.getUserEmail());
            assertEquals(null, event.getUserEmail());
           // assertEquals(null, event.getTimestamp());


           // eventBuilder.setTimestamp(analysisEvent.getAnalysedAt().getTime());-
           

            
            latch.countDown();
            return null;
        }).when(sonarqubeWebhookListener)
            .onAnalysisCompletedEvent(any(Event.class));

        sonarqubeWebhookManager.onNewSonarqubeEvent(request);
        latch.await();
    }

   
    @Test
    public void shouldThrowErrorIfCantParseHTTPRequestBody() throws IOException {
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("BAD_JSON.json");

        SonarqubeWebhookManager sonarqubeWebhookManager =
                new SonarqubeWebhookManager(sonarqubeWebhookListener);

        assertThrows(SonarqubeWebhookException.class, () -> sonarqubeWebhookManager.onNewSonarqubeEvent(request));
    }

}
