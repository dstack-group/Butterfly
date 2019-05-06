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
 * RedmineWebhookClientTest tests that, given a mocked HTTP request, the correct events are emitted from
 * the RedmineWebhookClientTest class. The JSON payloads for the HTTP requests are read from the test/resources folder.
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.redmine.testutils.TestUtils;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListener;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListenerObserver;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;
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

public class RedmineWebhookClientTest {
    @Mock
    private RedmineWebhookListener<Event> redmineWebhookListener;

    @Mock
    private WebhookListener webhookListener;

    public RedmineWebhookClientTest() {
        MockitoAnnotations.initMocks(this);
    }

    private TestUtils testUtils = new TestUtils();

    @Test
    public void noEventShouldBeEmittedIfThereAreNoListeners() throws Exception {
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("REDMINE_TICKET_CREATED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        var redmineWebhookClient = new RedmineWebhookClient(prioritiesToConsider);
        RedmineWebhookListenerObserver redmineWebhookListenerObserver =
                new RedmineWebhookListenerObserver(redmineWebhookListener);
        redmineWebhookClient.addListener(redmineWebhookListenerObserver);
        redmineWebhookClient.removeListener(redmineWebhookListenerObserver);

        redmineWebhookClient.handleEvent(request);

        verify(redmineWebhookListener, never()).onIssueCreatedEvent(any(Event.class));
        verify(redmineWebhookListener, never()).onIssueEditedEvent(any(Event.class));
    }

    @Test
    public void shouldParseIssueCreatedJSON() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("REDMINE_TICKET_CREATED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        var redmineWebhookClient = new RedmineWebhookClient(prioritiesToConsider);
        redmineWebhookClient.addListener(webhookListener);

        doAnswer((Answer<Void>) invocation -> {
            IssueCreatedPayload payload = invocation.getArgument(0);
            assertEquals("http://localhost:15000/issues/2", payload.getUrl());
            assertEquals(2, payload.getIssue().getId());
            assertEquals("New bug created by Doge", payload.getIssue().getSubject());
            assertEquals("A doge has to fix a new bug that affects the User Manager", payload.getIssue().getDescription());
            assertEquals(10, payload.getIssue().getDoneRatio());
            assertEquals(5, payload.getIssue().getEstimatedHours());
            assertEquals(1, payload.getIssue().getProject().getId());
            assertEquals("Butterfly", payload.getIssue().getProject().getIdentifier());
            assertEquals("Butterfly", payload.getIssue().getProject().getName());
            assertEquals("", payload.getIssue().getProject().getDescription());
            assertEquals("http://redmine.dstackgroup.com/butterfly/butterfly", payload.getIssue().getProject().getHomepage());
            assertEquals(1, payload.getIssue().getStatus().getId());
            assertEquals("new", payload.getIssue().getStatus().getName());
            assertEquals(1, payload.getIssue().getTracker().getId());
            assertEquals("Bug", payload.getIssue().getTracker().getName());
            assertEquals(1, payload.getIssue().getPriority().getId(), 1);
            assertEquals("alta", payload.getIssue().getPriority().getName());

            assertEquals(1, payload.getIssue().getAuthor().getId());
            assertEquals("admin", payload.getIssue().getAuthor().getLogin());
            assertEquals("admin@example.net", payload.getIssue().getAuthor().getMail());
            assertEquals("Redmine", payload.getIssue().getAuthor().getFirstname());
            assertEquals("Admin", payload.getIssue().getAuthor().getLastname());

            assertEquals(1, payload.getIssue().getAssignee().getId());
            assertEquals("admin", payload.getIssue().getAssignee().getLogin());
            assertEquals("admin@example.net", payload.getIssue().getAssignee().getMail());
            assertEquals("Redmine", payload.getIssue().getAssignee().getFirstname());
            assertEquals("Admin", payload.getIssue().getAssignee().getLastname());

            latch.countDown();
            return null;
        }).when(webhookListener)
                .onIssueCreatedEvent(any(IssueCreatedPayload.class));

        redmineWebhookClient.handleEvent(request);
    }

    @Test
    public void shouldParseIssueEditedJSON() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        HttpServletRequest request = testUtils.prepareMockHTTPRequest("REDMINE_TICKET_EDITED.json");
        Set<String> prioritiesToConsider = new HashSet<>(Arrays.asList("Alta", "Altissima"));

        var redmineWebhookClient = new RedmineWebhookClient(prioritiesToConsider);
        redmineWebhookClient.addListener(webhookListener);

        doAnswer((Answer<Void>) invocation -> {
            IssueEditedPayload payload = invocation.getArgument(0);
            assertEquals("http://localhost:15000/issues/2", payload.getUrl());
            assertEquals(3, payload.getIssue().getId());
            assertEquals("new new bug 2", payload.getIssue().getSubject());
            assertEquals("Descrizione di prova 2", payload.getIssue().getDescription());
            assertEquals(20, payload.getIssue().getDoneRatio());
            assertEquals(6, payload.getIssue().getEstimatedHours());
            assertEquals(1, payload.getIssue().getProject().getId());
            assertEquals("Amazon", payload.getIssue().getProject().getIdentifier());
            assertEquals("Amazon", payload.getIssue().getProject().getName());
            assertEquals("", payload.getIssue().getProject().getDescription());
            assertEquals("http://redmine.dstackgroup.com/amazon/amazon", payload.getIssue().getProject().getHomepage());
            assertEquals(1, payload.getIssue().getStatus().getId());
            assertEquals("new", payload.getIssue().getStatus().getName());
            assertEquals(1, payload.getIssue().getTracker().getId());
            assertEquals("Fix", payload.getIssue().getTracker().getName());
            assertEquals(1, payload.getIssue().getPriority().getId());
            assertEquals("altissima", payload.getIssue().getPriority().getName());

            assertEquals(1, payload.getIssue().getAuthor().getId());
            assertEquals("admin", payload.getIssue().getAuthor().getLogin());
            assertEquals("admin@example.net", payload.getIssue().getAuthor().getMail());
            assertEquals("Redmine", payload.getIssue().getAuthor().getFirstname());
            assertEquals("Admin", payload.getIssue().getAuthor().getLastname());

            assertEquals(5, payload.getIssue().getAssignee().getId());
            assertEquals("ppallino", payload.getIssue().getAssignee().getLogin());
            assertEquals("pinco@gmail.com", payload.getIssue().getAssignee().getMail());
            assertEquals("pallino", payload.getIssue().getAssignee().getFirstname());
            assertEquals("pinco", payload.getIssue().getAssignee().getLastname());

            assertEquals(5, payload.getJournal().getId());
            assertEquals("", payload.getJournal().getNotes());
            assertEquals(1, payload.getJournal().getAuthor().getId());
            assertEquals("admin", payload.getJournal().getAuthor().getLogin());
            assertEquals("admin@example.net", payload.getJournal().getAuthor().getMail());
            assertEquals("Redmine", payload.getJournal().getAuthor().getFirstname());
            assertEquals("Admin", payload.getJournal().getAuthor().getLastname());

            var details = payload.getJournal().getDetails();
            assertEquals(3, details.size());
            assertEquals(5, details.get(0).getId());
            assertEquals("new new bug 2", details.get(0).getValue());
            assertEquals("new bug 2", details.get(0).getOldValue());
            assertEquals("subject", details.get(0).getPropKey());
            assertEquals("attr", details.get(0).getProperty());

            assertEquals(6, details.get(1).getId());
            assertEquals("20", details.get(1).getValue());
            assertEquals("10", details.get(1).getOldValue());
            assertEquals("done_ratio", details.get(1).getPropKey());
            assertEquals("attr", details.get(1).getProperty());

            assertEquals(7, details.get(2).getId());
            assertEquals("6.0", details.get(2).getValue());
            assertEquals("5.0", details.get(2).getOldValue());
            assertEquals("estimated_hours", details.get(2).getPropKey());
            assertEquals("attr", details.get(2).getProperty());

            latch.countDown();
            return null;
        }).when(webhookListener)
                .onIssueEditedEvent(any(IssueEditedPayload.class));

        redmineWebhookClient.handleEvent(request);
    }
}
