/**
 * Returns the user that matches the given id
 */
UPDATE ${schema~}.user u
SET u.firstName = ${firstName},
    u.lastName = ${lastName}
WHERE u.user_id = ${userId}
