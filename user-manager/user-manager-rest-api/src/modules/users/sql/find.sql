/**
 * Returns the list of users
 */
SELECT user_id AS "userId",
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
FROM ${schema~}.user
ORDER BY user_id ASC
