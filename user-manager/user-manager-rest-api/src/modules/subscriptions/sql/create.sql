/**
 * Creates a new subscription identified by the given user email, project name, and event type.
 */
SELECT *
FROM public.create_subscription(
  ${userEmail},
  ${projectName},
  ${eventType},
  ${userPriority},
  ${contactServices}::public.consumer_service[],
  ${keywords}::text[]
);
