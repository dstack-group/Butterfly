/**
 * Returns the user that matches the given email
 */
SELECT user_id AS "userId",
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
FROM ${schema~}.user
WHERE email = ${email}
