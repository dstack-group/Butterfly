/**
 * Deletes the user that matches the given id
 */
DELETE
FROM ${schema~}.user u
WHERE u.user_id = ${userId}
