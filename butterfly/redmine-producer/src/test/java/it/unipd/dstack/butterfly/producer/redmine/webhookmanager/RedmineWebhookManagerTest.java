/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookManagerTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * RedmineWebhookManagerTest tests that, given a mocked HTTP request, the correct events are emitted from
 * the RedmineWebhookManager class. The JSON payloads for the HTTP requests are read from the test/resources folder.
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.redmine.ReadJSONFile;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookException;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListener;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListenerObserver;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookManager;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.stubbing.Answer;
import org.springframework.mock.web.MockHttpServletRequest;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.Services;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class RedmineWebhookManagerTest {
    @Mock
    private RedmineWebhookListener<Event> redmineWebhookListener;

    public RedmineWebhookManagerTest() {
        MockitoAnnotations.initMocks(this);
    }

    private ReadJSONFile readJSONFile = new ReadJSONFile();

    private HttpServletRequest prepareMockHTTPRequest(String jsonFilename) throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String payload = readJSONFile.readJSONFile(jsonFilename);
        request.setContent(payload.getBytes());
        return request;
    }

    @Test
    public void shouldParseIssueCreatedEventsFromHTTPRequest() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = prepareMockHTTPRequest("REDMINE_TICKET_CREATED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        RedmineWebhookManager redmineWebhookManager =
                new RedmineWebhookManager(redmineWebhookListener, prioritiesToConsider);

        doAnswer((Answer<Void>) invocation -> {
            Event event = invocation.getArgument(0);
            assertEquals(ServiceEventTypes.REDMINE_TICKET_CREATED, event.getEventType());
            assertEquals(Services.REDMINE, event.getService());
            assertEquals("New bug created by Doge", event.getTitle());
            assertEquals("A doge has to fix a new bug that affects the User Manager", event.getDescription());
            assertEquals("2", event.getEventId());
            assertEquals("Butterfly", event.getProjectName());
            assertEquals("http://redmine.dstackgroup.com/butterfly/butterfly", event.getProjectURL());
            assertEquals(List.of("Bug"), event.getTags());
            assertEquals("admin@example.net", event.getUserEmail());
            latch.countDown();
            return null;
        }).when(redmineWebhookListener)
            .onIssueCreatedEvent(any(Event.class));

        redmineWebhookManager.onNewRedmineEvent(request);
        latch.await();
    }

    @Test
    public void shouldParseIssueEditedEventsFromHTTPRequest() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = prepareMockHTTPRequest("REDMINE_TICKET_EDITED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        RedmineWebhookManager redmineWebhookManager =
                new RedmineWebhookManager(redmineWebhookListener, prioritiesToConsider);

        doAnswer((Answer<Void>) invocation -> {
            Event event = invocation.getArgument(0);
            assertEquals(ServiceEventTypes.REDMINE_TICKET_EDITED, event.getEventType());
            assertEquals(Services.REDMINE, event.getService());
            assertEquals("new new bug 2", event.getTitle());
            assertEquals("Descrizione di prova 2", event.getDescription());
            assertEquals("3", event.getEventId());
            assertEquals("Amazon", event.getProjectName());
            assertEquals("http://redmine.dstackgroup.com/amazon/amazon", event.getProjectURL());
            assertEquals(List.of("Fix"), event.getTags());
            assertEquals("admin@example.net", event.getUserEmail());
            latch.countDown();
            return null;
        }).when(redmineWebhookListener)
                .onIssueEditedEvent(any(Event.class));

        redmineWebhookManager.onNewRedmineEvent(request);
        latch.await();
    }

    @Test
    public void shouldThrowErrorIfCantParseHTTPRequestBody() throws IOException {
        HttpServletRequest request = prepareMockHTTPRequest("BAD_JSON.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        RedmineWebhookManager redmineWebhookManager =
                new RedmineWebhookManager(redmineWebhookListener, prioritiesToConsider);

        assertThrows(RedmineWebhookException.class, () -> redmineWebhookManager.onNewRedmineEvent(request));
    }

    @Test
    public void noEventShouldBeEmittedIfPriorityDoesntMatch() throws Exception {
        HttpServletRequest request = prepareMockHTTPRequest("REDMINE_TICKET_CREATED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Bassa"));

        RedmineWebhookManager redmineWebhookManager =
                new RedmineWebhookManager(redmineWebhookListener, prioritiesToConsider);

        redmineWebhookManager.onNewRedmineEvent(request);

        verify(redmineWebhookListener, never()).onIssueCreatedEvent(any(Event.class));
    }

    @Test
    public void noEventShouldBeEmittedIfThereAreNoListeners() throws Exception {
        HttpServletRequest request = prepareMockHTTPRequest("REDMINE_TICKET_CREATED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        var redmineWebhookClient = new RedmineWebhookClient(prioritiesToConsider);
        RedmineWebhookListenerObserver redmineWebhookListenerObserver = new RedmineWebhookListenerObserver(redmineWebhookListener);
        redmineWebhookClient.addListener(redmineWebhookListenerObserver);
        redmineWebhookClient.removeListener(redmineWebhookListenerObserver);

        redmineWebhookClient.handleEvent(request);

        verify(redmineWebhookListener, never()).onIssueCreatedEvent(any(Event.class));
        verify(redmineWebhookListener, never()).onIssueEditedEvent(any(Event.class));
    }
}
