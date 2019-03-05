WITH EVENT_RECORD AS (
    SELECT NOW() AS timestamp,
	    public.producer_service ${service} AS service,
	    ${projectName} AS project_name,
        ${projectURL} AS project_url,
	    ${eventId} AS event_id,
	    public.service_event_type ${eventType} AS event_type,
        ${userEmail} AS user_email,
        ${title} AS title,
        ${description} AS description,
        ${tags}::text[] AS tags
),
USERS_WITH_SIMILAR_PROJECT_NAME AS (
	SELECT uwp.*
	FROM public.v_filtered_users_project uwp
	JOIN EVENT_RECORD r ON TRUE
	WHERE r.project_name ILIKE '%' || uwp.project_name || '%'
),
USERS_WITH_SAME_PROJECT_URL AS (
	SELECT uwp.*
	FROM public.v_filtered_users_project uwp
	JOIN EVENT_RECORD r ON TRUE
	WHERE uwp.project_url @> ('{"' || LOWER(r.service::text) || '": "' || r.project_url || '"}')::jsonb
),
USERS_WITH_SAME_EMAIL AS (
	SELECT uwp.*
	FROM public.v_filtered_users_project uwp
	JOIN EVENT_RECORD r ON TRUE
	WHERE r.user_email ILIKE uwp.email
),
USERS_BY_PROJECT_URL_MATCH_UNION AS (
	SELECT user_id,
		2 AS priority
	FROM USERS_WITH_SAME_PROJECT_URL
	UNION ALL
	SELECT user_id,
		1 AS priority
	FROM USERS_WITH_SIMILAR_PROJECT_NAME
),
USERS_BY_PROJECT_URL_MATCH AS (
	SELECT u1.* FROM USERS_BY_PROJECT_URL_MATCH_UNION u1
	JOIN (
		SELECT user_id,
            MAX(priority) priority
		FROM USERS_BY_PROJECT_URL_MATCH_UNION
		WHERE user_id NOT IN (
			SELECT user_id
			FROM USERS_WITH_SAME_EMAIL
		)
		GROUP BY user_id
	) u2
		ON u1.user_id = u2.user_id
		AND u1.priority = u2.priority
),
KEYWORDS AS (
    SELECT k.keyword,
        u.user_id,
        u.priority
    FROM public.keywords k
    JOIN USERS_BY_PROJECT_URL_MATCH u
	    ON u.user_id = k.user_Id
),
KEYWORDS_GROUPED AS (
    SELECT k.keyword,
        array_agg(
            json_build_object(
                'user_id', k.user_id,
                'priority', k.priority
            )
        ) AS user_arr
    FROM KEYWORDS k
    GROUP BY k.keyword
),
KEYWORD_ARR AS (
  SELECT array_agg(k.keyword) keyword_arr
  FROM KEYWORDS_GROUPED k
),
SEARCH AS (
	SELECT kg.keyword,
		kg.user_arr
	FROM KEYWORDS_GROUPED kg
	JOIN EVENT_RECORD r ON true
	WHERE r.description ILIKE '%' || kg.keyword || '%'
        OR r.title ILIKE '%' || kg.keyword || '%'
		OR kg.keyword = ANY(r.tags)
),
BEST_MATCH_SEARCH AS (
    -- this cast is needed otherwise I can't join later
	SELECT CAST(u->>'user_id' AS BIGINT) as user_id,
		u->>'priority' AS priority,
		COUNT(*) AS n_keyword_match_occurs
	FROM SEARCH,
	    unnest(user_arr) AS u
	GROUP BY 1, 2
),
BEST_MATCH_SEARCH_RANK AS (
	SELECT user_id,
		n_keyword_match_occurs,
		priority,
		RANK () OVER (
			ORDER BY n_keyword_match_occurs DESC,
			    priority DESC
		) AS rank
	FROM BEST_MATCH_SEARCH
	ORDER BY rank
),
CONTACT_INFO_JSON_MAP_BY_USER_ID AS (
	SELECT m.user_id,
			jsonb_object_agg(
				xuc.contact_type, xuc.contact_ref
			) AS contact_info
	FROM BEST_MATCH_SEARCH_RANK m
	JOIN public.x_user_contact xuc
		ON xuc.user_id = m.user_id
	GROUP BY m.user_id
),
USER_CONTACTS_INFO AS (
	SELECT u.user_id,
		u.email,
		u.firstname,
		u.lastname,
		c.contact_info
	FROM CONTACT_INFO_JSON_MAP_BY_USER_ID c
	JOIN v_filtered_users u
		ON u.user_id = c.user_id
)
SELECT r.timestamp,
	r.service,
	r.project_name,
	r.project_url,
	r.event_id,
	r.event_type,
	r.title,
	r.description,
	r.tags,
	user_contacts
FROM EVENT_RECORD r
JOIN (
	SELECT COALESCE(
		array_agg(row_to_json(u.*)),
		array[]::json[]
	) AS user_contacts
	FROM USER_CONTACTS_INFO u
) t(user_contacts) ON TRUE
