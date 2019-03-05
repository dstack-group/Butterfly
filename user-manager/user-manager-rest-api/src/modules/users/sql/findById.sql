/**
 * Returns the user that matches the given id
 */
SELECT u.*
FROM ${schema~}.user u
WHERE u.user_id = ${userId}
