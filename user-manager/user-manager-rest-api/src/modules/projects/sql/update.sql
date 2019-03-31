/**
 * Updates the project with the given name and returns the updated record
 */
UPDATE ${schema~}.project
SET project_url = (project_url || ${projectURLMap}::jsonb)
WHERE project_name = ${projectName}
RETURNING *
