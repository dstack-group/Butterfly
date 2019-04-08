/**
 * Deletes the user that matches the given id
 */
DELETE
FROM ${schema~}.user
WHERE email = ${email}
