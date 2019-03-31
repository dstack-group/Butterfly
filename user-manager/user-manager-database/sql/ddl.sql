SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS public;
-- ALTER SCHEMA public OWNER TO butterfly_user;

-------- DDL ---------------------

CREATE TYPE public.producer_service AS ENUM (
	'REDMINE',
	'GITLAB',
	'SONARQUBE'
);

CREATE TYPE public.consumer_service AS ENUM (
	'TELEGRAM',
	'EMAIL',
	'SLACK'
);

CREATE TYPE public.user_priority AS ENUM (
	'LOW',
	'MEDIUM',
	'HIGH'
);

CREATE TYPE public.service_event_type AS ENUM (
	'REDMINE_TICKET_CREATED',
	'REDMINE_TICKET_EDITED',
	'REDMINE_TICKET_PRIORITY_EDITED',
	'REDMINE_USER_ADDED',

	'GITLAB_COMMIT_CREATED',
	'GITLAB_ISSUE_CREATED',
	'GITLAB_ISSUE_EDITED',

	'SONARQUBE_PROJECT_ANALYSIS_COMPLETED'
);

/**
 * `public.service` assigns an id to services like 'TELEGRAM' or 'GITLAB' to link them later in the
 * `public.x_service_event_type` association.
 */
CREATE SEQUENCE public.service_id_seq;
CREATE TABLE public.service (
	service_id BIGINT NOT NULL DEFAULT nextval('public.service_id_seq'),
	producer_service_key public.producer_service NOT NULL,
	CONSTRAINT service_pkey PRIMARY KEY (service_id),
	CONSTRAINT service_id_producer_service_key_unique
        UNIQUE (service_id, producer_service_key)
);
ALTER SEQUENCE public.service_id_seq OWNED BY public.service.service_id;

/**
 * `public.event_type` assigns an id to event types like 'GITLAB_COMMIT_CREATED' or 'REDMINE_TICKET_CREATED'
 * to link them later in the `public.x_service_event_type` association.
 */
CREATE SEQUENCE public.event_type_id_seq;
CREATE TABLE public.event_type (
	event_type_id BIGINT NOT NULL DEFAULT nextval('public.event_type_id_seq'),
	event_type_key public.service_event_type NOT NULL,
	CONSTRAINT event_type_pkey PRIMARY KEY (event_type_id),
	CONSTRAINT event_type_id_event_type_key_unique
        UNIQUE (event_type_id, event_type_key)
);
ALTER SEQUENCE public.event_type_id_seq OWNED BY public.event_type.event_type_id;

/**
 * `public.x_service_event_type` links services and event types.
 * For example, it states that the 'GITLAB_COMMIT_CREATED' event belongs to the
 * 'GITLAB' producer service
 */
CREATE SEQUENCE public.x_service_event_type_id_seq;
CREATE TABLE public.x_service_event_type (
	x_service_event_type_id BIGINT NOT NULL DEFAULT nextval('public.x_service_event_type_id_seq'),
	service_id BIGINT NOT NULL,
	event_type_id BIGINT NOT NULL, -- TODO: add index to event_type_id
	CONSTRAINT x_service_event_type_pkey PRIMARY KEY (x_service_event_type_id),
	CONSTRAINT x_service_id_event_type_id_unique
        UNIQUE (service_id, event_type_id),
	CONSTRAINT x_service_event_type_service_fkey
		FOREIGN KEY (service_id)
		REFERENCES public.service (service_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT x_service_event_type_event_type_fkey
		FOREIGN KEY (event_type_id)
		REFERENCES public.event_type (event_type_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
ALTER SEQUENCE public.x_service_event_type_id_seq OWNED BY public.x_service_event_type.x_service_event_type_id;

CREATE SEQUENCE public.project_id_seq;
CREATE TABLE public.project (
	project_id BIGINT NOT NULL DEFAULT nextval('public.project_id_seq'),
	project_name VARCHAR(30) NOT NULL,
	project_url jsonb,
	CONSTRAINT project_pkey PRIMARY KEY (project_id),
	CONSTRAINT project_project_name_unique
        UNIQUE (project_name)
);
ALTER SEQUENCE public.project_id_seq OWNED BY public.project.project_id;

CREATE SEQUENCE public.user_id_seq;
CREATE TABLE public.user (
	user_id BIGINT NOT NULL DEFAULT nextval('public.user_id_seq'),
	username VARCHAR(16) NOT NULL
        UNIQUE, -- TODO: to remove
	email VARCHAR(30) NOT NULL
        UNIQUE,
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	password VARCHAR(30) NOT NULL, -- TODO: for the future
	enabled BOOLEAN DEFAULT true NOT NULL,
	created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
	modified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (user_id)
);
ALTER SEQUENCE public.user_id_seq OWNED BY public.user.user_id;

CREATE SEQUENCE public.x_user_contact_id_seq;
CREATE TABLE public.x_user_contact (
	x_user_contact_id BIGINT NOT NULL DEFAULT nextval('public.x_user_contact_id_seq'),
	user_id BIGINT NOT NULL,
	contact_type public.consumer_service NOT NULL,
	contact_ref VARCHAR(30) NOT NULL,
	CONSTRAINT x_user_contact_pkey PRIMARY KEY (x_user_contact_id),
	CONSTRAINT x_user_contact_user_id_contact_type_unique
        UNIQUE (user_id, contact_type),
	CONSTRAINT x_user_contact_user_fkey
		FOREIGN KEY (user_id)
		REFERENCES public.user (user_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
ALTER SEQUENCE public.x_user_contact_id_seq OWNED BY public.x_user_contact.x_user_contact_id;

CREATE SEQUENCE public.keyword_id_seq;
CREATE TABLE public.keyword (
	keyword_id BIGINT NOT NULL DEFAULT nextval('public.keyword_id_seq'),
	keyword_name varchar(15) NOT NULL,
	CONSTRAINT keyword_pkey PRIMARY KEY (keyword_id),
	CONSTRAINT keyword_keyword_name_unique
        UNIQUE (keyword_name)
);
ALTER SEQUENCE public.keyword_id_seq OWNED BY public.keyword.keyword_id;

CREATE SEQUENCE public.subscription_id_seq;
CREATE TABLE public.subscription (
	subscription_id BIGINT NOT NULL DEFAULT nextval('public.subscription_id_seq'),
	user_id BIGINT NOT NULL,
	project_id BIGINT NOT NULL,
	x_service_event_type_id BIGINT NOT NULL,
	x_user_contact_id BIGINT NOT NULL,
	user_priority public.user_priority NOT NULL,
	CONSTRAINT subscription_pkey PRIMARY KEY (subscription_id),
	CONSTRAINT subscription_user_id_project_id_x_service_event_type_id_unique
        UNIQUE (user_id, project_id, x_service_event_type_id),
	CONSTRAINT subscription_user_id_fkey
		FOREIGN KEY (user_id)
		REFERENCES public.user (user_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT subscription_project_id_fkey
		FOREIGN KEY (project_id)
		REFERENCES public.project (project_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT subscription_x_service_event_type_id_fkey
		FOREIGN KEY (x_service_event_type_id)
		REFERENCES public.x_service_event_type (x_service_event_type_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT subscription_x_user_contact_id_fkey
		FOREIGN KEY (x_user_contact_id)
		REFERENCES public.x_user_contact (x_user_contact_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
ALTER SEQUENCE public.subscription_id_seq OWNED BY public.subscription.subscription_id;

CREATE TABLE public.x_subscription_keyword (
	subscription_id BIGINT NOT NULL,
	keyword_id BIGINT NOT NULL,
	CONSTRAINT x_subscription_keyword_pkey PRIMARY KEY (subscription_id, keyword_id),
	CONSTRAINT x_subscription_keyword_subscription_fkey
		FOREIGN KEY (subscription_id)
		REFERENCES public.subscription (subscription_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT x_subscription_keyword_keyword_fkey
		FOREIGN KEY (keyword_id)
		REFERENCES public.keyword (keyword_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE SEQUENCE public.event_sent_log_id_seq;
CREATE TABLE public.event_sent_log (
	event_sent_log_id BIGINT NOT NULL DEFAULT nextval('public.event_sent_log_id_seq'),
	user_id BIGINT NOT NULL,
	created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
	producer_service_key public.producer_service NOT NULL,
	event_type_id BIGINT NOT NULL,
	project_id BIGINT NOT NULL,
	CONSTRAINT event_sent_log_user_fkey
		FOREIGN KEY (user_id)
		REFERENCES public.user (user_id)
		ON DELETE CASCADE,
	CONSTRAINT event_sent_log_event_type_fkey
		FOREIGN KEY (event_type_id)
		REFERENCES public.event_type (event_type_id)
		ON DELETE CASCADE,
	CONSTRAINT event_sent_log_project_fkey
		FOREIGN KEY (project_id)
		REFERENCES public.project (project_id)
		ON DELETE CASCADE
);

----------------- VIEWS -------------------

/*
`public.v_filtered_users` only includes users which:
- have subscribed at least to a project
- have defined at least a contact system
- have defined at least a prefered producer event
- have defined at least a keyword
- are enabled
*/
CREATE OR REPLACE VIEW public.v_filtered_users AS (
	SELECT DISTINCT u.user_id,
		u.email,
		u.firstname,
		u.lastname
	 FROM "user" u
		 JOIN subscription s ON s.user_id = u.user_id
	WHERE u.enabled = true
);

------------------ FUNCTIONS ----------------

DROP TYPE IF EXISTS public.subscription_type;
CREATE TYPE public.subscription_type AS
(
	subscription_id BIGINT,
	user_id BIGINT,
	project_id BIGINT,
	x_service_event_type_id BIGINT,
	x_user_contact_id BIGINT,
	user_priority public.user_priority
);

CREATE OR REPLACE FUNCTION public.create_subscription(
	in_user_id bigint,
	in_project_name text,
	in_event_type_key public.service_event_type,
	in_contact_type public.consumer_service,
	in_user_priority public.user_priority,
	in_keyword_name_list text[])
		RETURNS public.subscription_type
		LANGUAGE plpgsql

		COST 100
		VOLATILE 
AS $$
#variable_conflict use_variable
DECLARE v_x_user_contact_id BIGINT;
DECLARE v_project_id BIGINT;
DECLARE v_event_type_id BIGINT;
DECLARE v_x_service_event_type_id BIGINT;
DECLARE v_subscription_id BIGINT;
DECLARE v_result subscription_type;
DECLARE v_curr_keyword_name text;
DECLARE v_curr_keyword_id BIGINT;
DECLARE v_keyword_id_list BIGINT[];
BEGIN
	SELECT xuc.x_user_contact_id
	FROM public.x_user_contact xuc
	WHERE xuc.user_id = in_user_id
		AND xuc.contact_type = in_contact_type
	INTO v_x_user_contact_id;
	
	IF v_x_user_contact_id IS NULL THEN
		RAISE EXCEPTION 'CONTACT_NOT_FOUND';
	END IF;
	
	SELECT p.project_id
	FROM public.project p
	WHERE p.project_name = in_project_name
	INTO v_project_id;
	
	IF v_x_user_contact_id IS NULL THEN
		RAISE EXCEPTION 'PROJECT_NOT_FOUND';
	END IF;
	
	SELECT e.event_type_id
	FROM public.event_type e
	WHERE e.event_type_key = in_event_type_key
	INTO v_event_type_id;
	
	IF v_event_type_id IS NULL THEN
		RAISE EXCEPTION 'EVENT_TYPE_NOT_FOUND';
	END IF;
	
	SELECT xse.x_service_event_type_id
	FROM public.x_service_event_type xse
	WHERE xse.event_type_id = v_event_type_id
	INTO v_x_service_event_type_id;
	
	RAISE LOG 'x_user_contact_id: %', v_x_user_contact_id;
	RAISE LOG 'project_id: %', v_project_id;
	RAISE LOG 'event_type_id: %', v_event_type_id;
	RAISE LOG 'x_service_event_type_id: %', v_x_service_event_type_id;
	
	v_keyword_id_list = array[]::text[];

	LOCK TABLE public.keyword IN SHARE ROW EXCLUSIVE MODE;
	LOCK TABLE public.x_subscription_keyword IN SHARE ROW EXCLUSIVE MODE;

	FOREACH v_curr_keyword_name IN ARRAY in_keyword_name_list
	LOOP
		SELECT k.keyword_id
		FROM public.keyword k
		WHERE k.keyword_name = v_curr_keyword_name
		INTO v_curr_keyword_id;

		IF v_curr_keyword_id IS NULL THEN
			INSERT INTO public.keyword (keyword_id, keyword_name)
			VALUES (DEFAULT, v_curr_keyword_name)
			RETURNING keyword_id INTO v_curr_keyword_id;
		END IF;

		v_keyword_id_list = v_keyword_id_list || v_curr_keyword_id;
	END LOOP;

	RAISE LOG 'v_keyword_id_list: %', v_keyword_id_list;

	INSERT INTO public.subscription (subscription_id, user_id, project_id, x_service_event_type_id, x_user_contact_id, user_priority)
	VALUES (DEFAULT, in_user_id, v_project_id, v_x_service_event_type_id, v_x_user_contact_id, in_user_priority)
	RETURNING * INTO v_result;

	FOREACH v_curr_keyword_id IN ARRAY v_keyword_id_list
	LOOP
		INSERT INTO public.x_subscription_keyword (subscription_id, keyword_id)
		VALUES (v_result.subscription_id, v_curr_keyword_id);
	END LOOP;
	
	RETURN v_result;
END;
$$;


----------------- PROCEDURES -----------------

/*
`trunc_data()` deletes every data inserted by the user
*/
CREATE OR REPLACE PROCEDURE public.trunc_data()
LANGUAGE plpgsql
AS $$
DECLARE
		truncate_query varchar;
BEGIN
		FOR truncate_query IN
				SELECT 'TRUNCATE ' || table_id || ' CASCADE;' AS truncate_query
				FROM (
					SELECT (schemaname || '.' || tablename) AS table_id
					FROM pg_catalog.pg_tables
					WHERE schemaname NOT LIKE 'pg_%'
					AND schemaname != 'information_schema'
				) user_tables
		LOOP
				EXECUTE truncate_query;
		END LOOP;
END;
$$;

/*
`init_event_data()` initializes the static data related to the event's relationships
*/
CREATE OR REPLACE PROCEDURE public.init_event_data()
LANGUAGE plpgsql
AS $$
BEGIN
		INSERT INTO public.service(service_id, producer_service_key) VALUES(1, 'REDMINE');
		INSERT INTO public.service(service_id, producer_service_key) VALUES(2, 'GITLAB');
		INSERT INTO public.service(service_id, producer_service_key) VALUES(3, 'SONARQUBE');

		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(1, 'REDMINE_TICKET_CREATED');
		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(2, 'REDMINE_TICKET_EDITED');
		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(3, 'REDMINE_TICKET_PRIORITY_EDITED');
		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(4, 'REDMINE_USER_ADDED');

		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(10, 'GITLAB_COMMIT_CREATED');
		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(11, 'GITLAB_ISSUE_CREATED');
		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(12, 'GITLAB_ISSUE_EDITED');

		INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(20, 'SONARQUBE_PROJECT_ANALYSIS_COMPLETED');

		-- REDMINE event types
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (1, 1, 1);
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (2, 1, 2);
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (3, 1, 3);
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (4, 1, 4);

		-- GITLAB event types
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (5, 2, 10);
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (6, 2, 11);
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (7, 2, 12);

		-- SONARQUBE event types
		INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (8, 3, 20);
END;
$$;

/*
`init_demo_data()` initializes the data needed for a demo presentation
*/
CREATE OR REPLACE PROCEDURE public.init_demo_data()
LANGUAGE plpgsql
AS $$
BEGIN
		INSERT INTO public.project(project_id, project_name, project_url) VALUES (1, 'Butterfly', '{"redmine": "redmine.dstackgroup.com/butterfly/butterfly.git", "gitlab": "https://localhost:10443/dstack/butterfly.git"}');
		INSERT INTO public.project(project_id, project_name, project_url) VALUES (2, 'Amazon', '{"gitlab": "gitlab.amazon.com/amazon/amazon.git"}');
		INSERT INTO public.project(project_id, project_name, project_url) VALUES (3, 'Uber', '{"gitlab": "gitlab.uber.com/uber/uber.git"}');
		INSERT INTO public.project(project_id, project_name, project_url) VALUES (4, 'Twitter', '{"sonarqube": "sonarqube.twitter.com/twitter/twitter.git", "gitlab": "gitlab.twitter.com/twitter/twitter.git"}');

		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (1, 'jkomyno', 'alberto.schiabel@gmail.com', 'Alberto', 'Schiabel', 'jkomyno');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (2, 'federicorispo', 'federico.rispo@gmail.com', 'Federico', 'Rispo', 'federicorispo');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (3, 'Dogemist', 'enrico.trinco@gmail.com', 'Enrico', 'Trinco', 'Dogemist');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (4, 'eleonorasignor', 'eleonorasignor@gmail.com', 'Eleonora', 'Signor', 'eleonorasignor');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (5, 'TheAlchemist97', 'TheAlchemist97@gmail.com', 'Niccolò', 'Vettorello', 'TheAlchemist97');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (6, 'elton97', 'elton97@gmail.com', 'Elton', 'Stafa', 'elton97');
		INSERT INTO public.user(user_id, username, email, firstname, lastname, password) VALUES (7, 'singh', 'singh@gmail.com', 'Harwinder', 'Singh', 'singh');

		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'TELEGRAM', 'jkomyno');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'SLACK', 'jkomyno');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'EMAIL', 'dstackgroup@gmail.com');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (2, 'TELEGRAM', 'frispo');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (2, 'EMAIL', 'dstackgroup@gmail.com');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (3, 'TELEGRAM', 'enrico_dogen');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (3, 'EMAIL', 'dstackgroup@gmail.com');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (4, 'TELEGRAM', 'mrossi');
		INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (4, 'EMAIL', 'dstackgroup@gmail.com');

		SELECT public.create_subscription(1, 'Butterfly', 'GITLAB_COMMIT_CREATED', 'TELEGRAM', 'HIGH', array['bug', 'fix', 'close']::text[]);
		SELECT public.create_subscription(1, 'Butterfly', 'GITLAB_ISSUE_CREATED', 'TELEGRAM', 'HIGH', array[]::text[]);
		SELECT public.create_subscription(1, 'Butterfly', 'GITLAB_COMMIT_CREATED', 'TELEGRAM', 'HIGH', array[]::text[]);
		SELECT public.create_subscription(2, 'Amazon', 'GITLAB_ISSUE_CREATED', 'TELEGRAM', 'LOW', array['fix', 'bug', 'resolve']::text[]);
		SELECT public.create_subscription(3, 'Amazon', 'GITLAB_ISSUE_CREATED', 'TELEGRAM', 'LOW', array['fix', 'bug', 'resolve']::text[]);
		SELECT public.create_subscription(4, 'Amazon', 'GITLAB_ISSUE_CREATED', 'EMAIL', 'HIGH', array['fix', 'bug', 'revert']::text[]);

END;
$$;

------------------ EXECUTE ------------------

CALL public.trunc_data();
CALL public.init_event_data();

/*

-- NEW QUERY (almost done)

WITH EVENT_RECORD AS (
	SELECT NOW() AS timestamp,
		public.producer_service 'GITLAB' AS service,
		'Amazon' AS project_name,
		'gitlab.amazon.com/amazon/amazon.git' AS project_url,
		1 AS event_id,
		public.service_event_type 'GITLAB_ISSUE_CREATED' AS event_type,
		'federico.rispo@gmail.com' AS user_email, -- the user that matches this email should be excluded from the result set
		'New performance bug for you' AS title,
		'Random and pretty long description that discusses about the importance of writing clean and performance-wise code. Something must be fixed.' AS description,
		array['bug', 'revert']::text[] AS tags
),
EVENT_PROJECT AS (
	SELECT p.project_id,
		p.project_name
	FROM public.project p,
		EVENT_RECORD r
	WHERE p.project_name = r.project_name
		AND p.project_url @> ('{"' || LOWER(r.service::text) || '": "' || r.project_url || '"}')::jsonb
),
EVENT_TYPE_ID AS (
	SELECT xset.x_service_event_type_id
	FROM EVENT_RECORD r
	JOIN public.service ser
		ON ser.producer_service_key = r.service
	JOIN public.event_type et
		ON et.event_type_key = r.event_type
	JOIN public.x_service_event_type xset
		ON xset.service_id = ser.service_id
		AND xset.event_type_id = et.event_type_id
),
SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT AS (
	SELECT s.*
	FROM public.v_filtered_users vfu
	JOIN EVENT_PROJECT p ON TRUE
	JOIN EVENT_TYPE_ID eti ON TRUE
	JOIN public.subscription s
		ON s.user_id = vfu.user_id
		AND s.x_service_event_type_id = eti.x_service_event_type_id
),
KEYWORDS_USER AS (
	SELECT DISTINCT k.*,
		s.user_id,
		s.user_priority,
		xuc.contact_type,
		xuc.contact_ref
	FROM SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT s
	JOIN public.x_subscription_keyword xsk
		ON xsk.subscription_id = s.subscription_id
	JOIN public.keyword k
		ON k.keyword_id = xsk.keyword_id
	JOIN public.x_user_contact xuc
		ON xuc.x_user_contact_id = s.x_user_contact_id
	WHERE NOT EXISTS(
		SELECT *
		FROM public.v_filtered_users u,
			EVENT_RECORD r
		WHERE u.user_id = s.user_id
			AND u.email = r.user_email
	)
),			  
KEYWORDS_GROUPED AS (
		SELECT ku.keyword_name,
				array_agg(
						json_build_object(
								'user_id', ku.user_id,
								'priority', ku.user_priority,
				'contact_type', ku.contact_type,
				'contact_ref', ku.contact_ref
						)
				) AS user_list
		FROM KEYWORDS_USER ku
		GROUP BY ku.keyword_name
),
SEARCH AS (
	SELECT kg.keyword_name,
		kg.user_list
	FROM KEYWORDS_GROUPED kg
	JOIN EVENT_RECORD r ON true
	WHERE r.description ILIKE '%' || kg.keyword_name || '%'
				OR r.title ILIKE '%' || kg.keyword_name || '%'
		OR kg.keyword_name = ANY(r.tags)
),
BEST_MATCH_SEARCH AS (
		-- this cast is needed otherwise I can't join later
	SELECT CAST(u->>'user_id' AS BIGINT) as user_id,
		u->>'priority' AS priority,
		u->>'contact_type' AS contact_type,
		u->>'contact_ref' AS contact_ref,
		COUNT(*) AS n_keyword_match_occurs
	FROM SEARCH,
			unnest(user_list) AS u
	GROUP BY 1, 2, 3, 4
),
RANK_BEST_MATCH_SEARCH AS (
	SELECT s.*,
		RANK () OVER (
			ORDER BY s.n_keyword_match_occurs DESC,
					s.priority DESC
		) AS rank
	FROM BEST_MATCH_SEARCH s
	ORDER BY rank
),
CONTACT_INFO_JSON_MAP_BY_USER_ID AS (
	SELECT m.user_id,
		jsonb_object_agg(
			m.contact_type, m.contact_ref
		) AS contact_info
	FROM RANK_BEST_MATCH_SEARCH m
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
SELECT COALESCE(
	array_agg(row_to_json(u.*)),
	array[]::json[]
) AS user_contacts
FROM USER_CONTACTS_INFO u
*/



/*
OLD QUERY
Returns the users to be notified about the current event record, their contact info and the original record.

WITH EVENT_RECORD AS (
	SELECT NOW() AS timestamp,
		public.producer_service 'GITLAB' AS service,
		'Amazon' AS project_name,
		'gitlab.amazon.com/amazon/amazon.git' AS project_url,
		1 AS event_id,
		public.service_event_type 'GITLAB_ISSUE_CREATED' AS event_type,
		'federico.rispo@gmail.com' AS user_email,
		'New performance bug for you' AS title,
		'Random and pretty long description that discusses about the importance of writing clean and performance-wise code. Something must be fixed.' AS description,
		array['bug', 'revert']::text[] AS tags
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
*/
