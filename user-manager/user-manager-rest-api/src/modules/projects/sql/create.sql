/**
 * Creates a new project and returns the newly inserted record
 */
INSERT INTO ${schema~}.project (project_name, project_url)
VALUES (${projectName}, ${projectURLMap})
RETURNING *
