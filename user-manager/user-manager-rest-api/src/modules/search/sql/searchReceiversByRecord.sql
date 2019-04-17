/*
SELECT "userContactList"
FROM public.search_event_receivers(
	${service},
	${projectName},
	${projectURL},
	${eventId},
	${eventType},
	${userEmail},
	${title},
	${description},
	${tags}::text[]
);
*/

SELECT "userContactList"
FROM public.search_event_receivers(${event}::json, ${saveEvent});
