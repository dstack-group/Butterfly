/**
 * Creates a new project and returns the newly inserted record
 */
INSERT INTO ${schema~}.project (project_name, project_url)
VALUES (${projectName}, ${projectURL})
RETURNING
    project_id AS "projectId",
    project_name AS "projectName",
    project_url AS "projectURL",
    created,
    modified
