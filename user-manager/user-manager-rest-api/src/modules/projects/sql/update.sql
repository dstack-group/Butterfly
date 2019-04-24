/**
 * Updates the project with the given name and returns the updated record
 */
WITH PATCH_PARAMS AS (
	  SELECT ${projectName}::text AS project_name,
        ${projectURL}::jsonb AS project_url
),
sel AS (
    SELECT p.project_id,
        p.project_name,
        p.project_url,
        p.created,
        p.modified
    FROM public.project p,
	PATCH_PARAMS pp
    WHERE p.project_name = pp.project_name
),
upd AS (
	UPDATE public.project AS pr
    SET project_name = COALESCE(p.project_name, pr.project_name),
        project_url = (pr.project_url::jsonb || COALESCE(p.project_url, '{}'::jsonb)),
        modified = NOW()
    FROM PATCH_PARAMS p
    WHERE pr.project_name = p.project_name AND (
        (p.project_name IS NOT NULL)
    )
    RETURNING pr.project_id,
        pr.project_name,
        pr.project_url,
        pr.created,
        pr.modified
)
SELECT sel.project_id AS "projectId",
	COALESCE(upd.project_name, sel.project_name) AS "projectName",
    COALESCE(upd.project_url, sel.project_url) AS "projectURL",
    sel.created AS created,
	COALESCE(upd.modified, sel.modified) AS modified
FROM sel
LEFT JOIN upd ON true
