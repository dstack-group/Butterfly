/**
 * Creates new user and returns the newly inserted record
 */
INSERT INTO ${schema~}.user (email, firstname, lastname)
VALUES (${email}, ${firstName}, ${lastName})
RETURNING
    user_id AS "userId"
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
