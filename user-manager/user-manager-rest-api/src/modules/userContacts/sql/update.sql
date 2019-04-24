/**
 * Updates the user that matches the given email and returns the updated record.
 */
WITH PATCH_PARAMS AS (
    SELECT ${contactService}::public.consumer_service AS contact_service,
        ${contactRef}::text AS contact_ref,
        ${userEmail}::text AS user_email
),
sel AS (
    SELECT uc.user_contact_id,
        uc.user_id,
        uc.contact_type,
        uc.contact_ref
    FROM public.user_contact uc,
		PATCH_PARAMS pp
    JOIN public.user u
        ON u.user_id = user_id
    WHERE u.email = pp.user_email
        AND uc.contact_type = contact_service
),
upd AS (
  UPDATE public.user_contact AS uc
    SET contact_ref = p.contact_ref
    FROM PATCH_PARAMS p
	JOIN public.user u
		ON u.email = p.user_email
	WHERE uc.contact_type = p.contact_service
		AND uc.user_id = u.user_id
    RETURNING uc.user_contact_id,
        uc.user_id,
        uc.contact_type,
        uc.contact_ref
)
SELECT upd.user_contact_id AS "userContactId",
    upd.user_id AS "userId",
	upd.contact_type AS "contactType",
    upd.contact_ref AS "contactRef"
FROM upd
