/**
 * Returns the user that matches the given email
 */
SELECT u.*
FROM ${schema~}.user u
WHERE u.email = ${email}
