/**
 * Removes the URL of the specified service from the project with the given name
 * and returns the updated record
 */
UPDATE ${schema~}.project
SET project_url = (project_url - ${serviceName})
WHERE project_name = ${projectName}
RETURNING *
