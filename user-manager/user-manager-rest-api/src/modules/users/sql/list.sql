/**
 * Returns a paginated list of users
 */
SELECT u.*
FROM ${schema~}.user u
LIMIT ${limit}
OFFSET ${offset}

