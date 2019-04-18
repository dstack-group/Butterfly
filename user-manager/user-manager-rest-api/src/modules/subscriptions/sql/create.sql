SELECT *
FROM ${schema~}.create_subscription(
  ${userEmail},
  ${projectName},
  ${eventType},
  ${userPriority},
  ${contactServices}::public.consumer_service[],
  ${keywords}::text[]
);
