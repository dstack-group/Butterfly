/**
 * Returns a paginated list of projects. The following structur is returned:
 *
{
  data: Array<{
    project_id: string;
    project_name: string;
    project_url:
  }>;
  n_pages: number; // total number of pages
}
 */
WITH project_list AS (
	SELECT p.*
	FROM ${schema~}.project p
	ORDER BY p.project_id
	LIMIT ${limit}
	OFFSET ${offset} -- (page - 1) * n_rows
),
n_pages AS (
	SELECT CEILING(COUNT(p.*) / 3) AS n_pages
	FROM public.project p
)
SELECT json_build_object(
	'data', COALESCE(array_agg(row_to_json(pl.*)), array[]::json[]),
	-- 'number_total', COUNT(pl.project_id),
	'n_pages', (SELECT n_pages FROM n_pages)
) AS result
FROM project_list pl
