/**
 * Removes the project with the given name
 */
DELETE
FROM ${schema~}.project
WHERE project_name = ${projectName}
