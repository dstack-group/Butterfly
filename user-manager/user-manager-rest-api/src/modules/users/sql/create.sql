/**
 * Creates new user and returns the newly inserted record
 */
INSERT INTO ${schema~}.user (email, firstname, lastname, "enabled")
VALUES (${email}, ${firstname}, ${lastname}, ${enabled})
RETURNING
    user_id AS "userId",
    email,
    firstname,
    lastname,
    enabled,
    created,
    modified
