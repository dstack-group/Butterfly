SELECT json_object_agg(uc.contact_type, uc.contact_ref) AS data
FROM public.user_contact uc
JOIN public.user u
	ON u.user_id = uc.user_id
WHERE u.email = ${userEmail}
