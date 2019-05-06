/**
 * Deletes the subscription with the given user email, project name, and event type.
 */
SELECT public.delete_subscription(
    ${userEmail},
    ${projectName},
    ${eventType}
) AS "count";
