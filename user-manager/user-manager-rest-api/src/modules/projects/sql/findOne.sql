/**
 * Returns the project that matches the given name
 */
SELECT project_id AS "projectId",
    project_name AS "projectName",
    project_url AS "projectURL",
    created,
    modified
FROM ${schema~}.project p
WHERE p.project_name = ${projectName}
