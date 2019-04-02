/**
 * Returns the user that matches the given id
 */
SELECT user_id AS "userId",
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
FROM ${schema~}.user
WHERE user_id = ${userId}
