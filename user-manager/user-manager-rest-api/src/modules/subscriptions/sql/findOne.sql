SELECT *
FROM public.find_subscription(
    ${userEmail},
    ${projectName},
    ${eventType}
);
