/**
 * Creates new user and returns the newly inserted record
 */
INSERT INTO ${schema~}.user (email, first_name, last_name)
VALUES (${email}, ${firstName}, ${lastName})
RETURNING u.*
