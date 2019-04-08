/**
 * Removes the URL of the specified service from the project with the given name
 * and returns the updated record.
 * TODO: this should probably be moved to a stored function that checks the amount of
 * projectURLs before removing them, in order not to have a project without any
 * associated URL.
 */
UPDATE ${schema~}.project
SET project_url = (project_url - ${producerService})
WHERE project_name = ${projectName}
RETURNING
    project_id AS "projectId",
    project_name AS "projectName",
    project_url AS "projectURL",
    created,
    modified
