/**
 * Returns the user that matches the given id
 */
UPDATE ${schema~}.user
SET firstname = ${firstName},
    lastname = ${lastName}
WHERE user_id = ${userId}
RETURNING
    user_id AS "userId",
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
