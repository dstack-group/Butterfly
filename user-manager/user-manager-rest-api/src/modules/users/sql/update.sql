/**
 * Updates the user that matches the given email and returns the updated record.
 */
WITH PATCH_PARAMS AS (
	SELECT ${firstname}::text AS firstname,
        ${lastname}::text AS lastname,
        ${enabled}::boolean AS enabled,
        ${email} AS email
),
sel AS (
    SELECT u.user_id,
        u.email,
        u.firstname,
        u.lastname,
        u.enabled,
        u.created,
        u.modified
    FROM public.user u,
		PATCH_PARAMS pp
    WHERE u.email = pp.email
),
upd AS (
  UPDATE public.user AS u
    SET firstname = COALESCE(p.firstname, u.firstname),
        lastname = COALESCE(p.lastname, u.lastname),
        enabled = COALESCE(p.enabled, u.enabled),
        modified = NOW()
    FROM PATCH_PARAMS p
    WHERE u.email = p.email AND (
        (p.firstname IS NOT NULL AND p.firstname IS DISTINCT FROM u.firstname) OR
        (p.lastname IS NOT NULL AND p.lastname IS DISTINCT FROM u.lastname) OR
        (p.enabled IS NOT NULL AND p.enabled IS DISTINCT FROM u.enabled)
    )
    RETURNING u.email,
        u.firstname,
        u.lastname,
        u.enabled,
        u.created,
        u.modified
)
SELECT sel.user_id AS "userId",
    sel.email,
	COALESCE(upd.firstname, sel.firstname) AS firstname,
  	COALESCE(upd.lastname, sel.lastname) AS lastname,
	COALESCE(upd.enabled, sel.enabled) AS enabled,
	sel.created AS created,
	COALESCE(upd.modified, sel.modified) AS modified
FROM sel
LEFT JOIN upd ON true
