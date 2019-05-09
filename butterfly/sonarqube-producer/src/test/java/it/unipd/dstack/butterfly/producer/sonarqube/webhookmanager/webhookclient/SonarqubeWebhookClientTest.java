/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookManagerTest.java
 * @created:   2019-05-09
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * SonarqubeWebhookClientTest tests that, given a mocked HTTP request, the correct events are emitted from
 * the RedmineWebhookClientTest class. The JSON payloads for the HTTP requests are read from the test/resources folder.
 */

package it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.sonarqube.testutils.TestUtils;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookListener;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookListenerObserver;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.model.AnalysisResult;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import it.unipd.dstack.butterfly.producer.avro.Event;
import org.mockito.stubbing.Answer;

import javax.servlet.http.HttpServletRequest;


import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SonarqubeWebhookClientTest {
    @Mock
    private SonarqubeWebhookListener<Event> sonarqubeWebhookListener;

    @Mock
    private WebhookListener webhookListener;

    public SonarqubeWebhookClientTest() {
        MockitoAnnotations.initMocks(this);
    }

    private TestUtils testUtils = new TestUtils();

    @Test
    public void noEventShouldBeEmittedIfThereAreNoListeners() throws Exception {
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("SONARQUBE_PROJECT_ANALYSIS_COMPLETED.json");
       

        var sonarqubeWebhookClient = new SonarqubeWebhookClient();
        SonarqubeWebhookListenerObserver sonarqubeWebhookListenerObserver =
                new SonarqubeWebhookListenerObserver(sonarqubeWebhookListener);
        sonarqubeWebhookClient.addListener(sonarqubeWebhookListenerObserver);
        sonarqubeWebhookClient.removeListener(sonarqubeWebhookListenerObserver);

        sonarqubeWebhookClient.handleEvent(request);

        verify(sonarqubeWebhookListener, never()).onAnalysisCompletedEvent(any(Event.class));
    }

    @Test
    public void shouldParseAnalysisCompletedJSON() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("SONARQUBE_PROJECT_ANALYSIS_COMPLETED.json");
        

        var sonarqubeWebhookClient = new SonarqubeWebhookClient();
        sonarqubeWebhookClient.addListener(webhookListener);

        doAnswer((Answer<Void>) invocation -> {
            AnalysisResult payload = invocation.getArgument(0);

            assertEquals("http://localhost:9000", payload.getServerUrl());
            assertEquals("AWpMVIXi300Bl9GYiThJ", payload.getTaskId());
            assertEquals("SUCCESS", payload.getStatus());
            assertEquals("it.unipd.dstack.butterfly:butterfly", payload.getProject().getKey());
            assertEquals("Butterfly", payload.getProject().getName());
            assertEquals("http://localhost:9000/dashboard?id=it.unipd.dstack.butterfly%3Abutterfly", payload.getProject().getUrl());
            assertEquals("master", payload.getBranch().getName());
            assertEquals("LONG", payload.getBranch().getType());
            assertEquals(true, payload.getBranch().getIsMain());
            assertEquals("http://localhost:9000/dashboard?id=it.unipd.dstack.butterfly%3Abutterfly", payload.getBranch().getUrl());
            assertEquals("Sonar way", payload.getQualityGate().getName());
            assertEquals("ERROR", payload.getQualityGate().getStatus());
            assertEquals("new_maintainability_rating: OK new_coverage: ERROR new_duplicated_lines_density: OK new_security_rating: OK new_reliability_rating: OK ", payload.getDescription());
    

            latch.countDown();
            return null;
        }).when(webhookListener)
                .onAnalysisCompletedEvent(any(AnalysisResult.class));

        sonarqubeWebhookClient.handleEvent(request);
    }

}
