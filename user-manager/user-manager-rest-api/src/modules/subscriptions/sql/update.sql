/**
 * Applies a partial update to the subscription with the given user email, project name, and event type.
 * If `userPriority` is NULL, the previous user priority value is kept.
 * If `contactServices` is NULL, the previous contact services are kept, but if `contactServices` is defined,
 * they are overridden with the new values.
 * If `keywords` is NULL, the previous contact services are kept, but if `keywords` is defined,
 * they are overridden with the new values.
 */
SELECT *
FROM public.update_subscription(
  ${userEmail},
  ${projectName},
  ${eventType},
  ${userPriority}, -- NULLABLE
  ${contactServices}::public.consumer_service[], -- NULLABLE
  ${keywords}::text[] -- NULLABLE
);
