/**
 * Returns the project that matches the given name
 */
SELECT p.*
FROM ${schema~}.project p
WHERE p.project_name = ${projectName}
