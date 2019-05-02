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

	'GITLAB_COMMIT_CREATED',
	'GITLAB_ISSUE_CREATED',
	'GITLAB_ISSUE_EDITED',
	'GITLAB_MERGE_REQUEST_CREATED',
	'GITLAB_MERGE_REQUEST_EDITED',
	'GITLAB_MERGE_REQUEST_MERGED',
	'GITLAB_MERGE_REQUEST_CLOSED',

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
	created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
	modified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	CONSTRAINT project_pkey PRIMARY KEY (project_id),
	CONSTRAINT project_project_name_unique
        UNIQUE (project_name)
);
ALTER SEQUENCE public.project_id_seq OWNED BY public.project.project_id;

CREATE SEQUENCE public.user_id_seq;
CREATE TABLE public.user (
	user_id BIGINT NOT NULL DEFAULT nextval('public.user_id_seq'),
	-- username VARCHAR(16) NOT NULL
  --      UNIQUE, -- TODO: to remove
	email VARCHAR(30) NOT NULL
        UNIQUE,
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	-- password VARCHAR(30) NOT NULL, -- TODO: for the future
	enabled BOOLEAN DEFAULT true NOT NULL,
	created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
	modified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (user_id)
);
ALTER SEQUENCE public.user_id_seq OWNED BY public.user.user_id;

CREATE SEQUENCE public.user_contact_id_seq;
CREATE TABLE public.user_contact (
	user_contact_id BIGINT NOT NULL DEFAULT nextval('public.user_contact_id_seq'),
	user_id BIGINT NOT NULL,
	contact_type public.consumer_service NOT NULL,
	contact_ref VARCHAR(30) NOT NULL,
	CONSTRAINT user_contact_pkey PRIMARY KEY (user_contact_id),
	CONSTRAINT user_contact_user_id_contact_type_unique
        UNIQUE (user_id, contact_type),
	CONSTRAINT user_contact_user_fkey
		FOREIGN KEY (user_id)
		REFERENCES public.user (user_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
ALTER SEQUENCE public.user_contact_id_seq OWNED BY public.user_contact.user_contact_id;

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
		ON DELETE CASCADE
);
ALTER SEQUENCE public.subscription_id_seq OWNED BY public.subscription.subscription_id;

CREATE TABLE public.x_subscription_user_contact (
  subscription_id BIGINT NOT NULL,
  user_contact_id BIGINT NOT NULL,
  CONSTRAINT x_subscription_user_contact_pkey PRIMARY KEY (subscription_id, user_contact_id),
  CONSTRAINT x_subscription_user_contact_subscription_fkey
    FOREIGN KEY (subscription_id)
    REFERENCES public.subscription (subscription_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT x_subscription_user_contact_user_contact_fkey
    FOREIGN KEY (user_contact_id)
    REFERENCES public.user_contact (user_contact_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

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
	producer_service_key public.producer_service NOT NULL,
  event_record json NOT NULL,
  CONSTRAINT event_sent_log_pkey PRIMARY KEY (event_sent_log_id)
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
	 FROM public.user u
		 JOIN public.subscription s ON s.user_id = u.user_id
	WHERE u.enabled = true
);

------------------ FUNCTIONS ----------------

DROP TYPE IF EXISTS public.subscription_denormalized_type CASCADE;
CREATE TYPE public.subscription_denormalized_type AS (
	"subscriptionId" BIGINT,
	"userEmail" text,
	"projectName" text,
	"eventType" public.service_event_type,
	"userPriority" public.user_priority,
	"contacts" jsonb, -- each user contact associated with this subscription 
	"keywordList" text[] -- each keyword associated with this subscription
);

CREATE OR REPLACE FUNCTION public.create_subscription(
	in_user_email text,
	in_project_name text,
	in_event_type_key public.service_event_type, -- GITLAB_COMMIT_CREATED, GITLAB_ISSUE_CREATED, ...
	in_user_priority public.user_priority,
	in_contact_type_list public.consumer_service[], -- TELEGRAM, EMAIL, SLACK
	in_keyword_name_list text[])
RETURNS public.subscription_denormalized_type
LANGUAGE plpgsql
COST 100
VOLATILE 
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_curr_contact_type public.consumer_service;
DECLARE v_user_contact_id_list BIGINT[];
DECLARE v_curr_user_contact_id BIGINT;
DECLARE v_project_id BIGINT;
DECLARE v_event_type_id BIGINT;
DECLARE v_x_service_event_type_id BIGINT;
DECLARE v_subscription_id BIGINT;
DECLARE v_result public.subscription_denormalized_type;
DECLARE v_curr_keyword_name text;
DECLARE v_curr_keyword_name_upper text;
DECLARE v_curr_keyword_id BIGINT;
DECLARE v_keyword_id_list BIGINT[];
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;

	-- Check that every contact type in the list is associated with the user
	-- identified by `v_user_id`. If it doesn't, 'CONTACT_NOT_FOUND' is thrown.
	v_user_contact_id_list = array[]::BIGINT[];
	FOREACH v_curr_contact_type IN ARRAY in_contact_type_list
	LOOP
		SELECT xuc.user_contact_id
		FROM public.user_contact xuc
		WHERE xuc.user_id = v_user_id
			AND xuc.contact_type = v_curr_contact_type
		INTO v_curr_user_contact_id;

		IF v_curr_user_contact_id IS NULL THEN
			RAISE EXCEPTION 'CONTACT_NOT_FOUND';
		END IF;

		-- pushes `v_curr_user_contact_id` into the array `v_user_contact_id_list`
		v_user_contact_id_list = v_user_contact_id_list || v_curr_user_contact_id;
		v_curr_user_contact_id = NULL; -- resets v_curr_user_contact_id
	END LOOP;

	-- Check that the project associated with the project name `in_project_name` exists.
	-- If it doesn't, 'PROJECT_NOT_FOUND' is thrown.
	SELECT p.project_id
	FROM public.project p
	WHERE p.project_name = in_project_name
	INTO v_project_id;
	
	IF v_project_id IS NULL THEN
		RAISE EXCEPTION 'PROJECT_NOT_FOUND';
	END IF;
	
	-- Check that the event type identified by `in_event_type_key` exists.
	-- If it doesn't, 'EVENT_TYPE_NOT_FOUND' is thrown.
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
	
	RAISE LOG 'user_contact_id_list: %', v_user_contact_id_list;
	RAISE LOG 'project_id: %', v_project_id;
	RAISE LOG 'event_type_id: %', v_event_type_id;
	RAISE LOG 'x_service_event_type_id: %', v_x_service_event_type_id;
	
	-- `public.x_subscription_keyword` uses ids to link a keywords to subscriptions.
	-- The following block ensures that for keywords that already exists, the previous ids are used,
	-- and for keywords that didn't, a new record in `public.keyword` is created.
	v_keyword_id_list = array[]::text[];

	LOCK TABLE public.keyword IN SHARE ROW EXCLUSIVE MODE;
	LOCK TABLE public.x_subscription_keyword IN SHARE ROW EXCLUSIVE MODE;

	FOREACH v_curr_keyword_name IN ARRAY in_keyword_name_list
	LOOP
		v_curr_keyword_name_upper = UPPER(v_curr_keyword_name);

		SELECT k.keyword_id
		FROM public.keyword k
		WHERE k.keyword_name = v_curr_keyword_name_upper
		INTO v_curr_keyword_id;

		IF v_curr_keyword_id IS NULL THEN
			INSERT INTO public.keyword (keyword_id, keyword_name)
			VALUES (DEFAULT, v_curr_keyword_name_upper)
			RETURNING keyword_id INTO v_curr_keyword_id;
		END IF;

		-- pushes `v_curr_keyword_id` into the array `v_keyword_id_list`
		v_keyword_id_list = v_keyword_id_list || v_curr_keyword_id;
		v_curr_keyword_id = NULL; -- resets v_curr_keyword_id
	END LOOP;

	RAISE LOG 'keyword_id_list: %', v_keyword_id_list;

	WITH INS AS (
		INSERT INTO public.subscription (subscription_id, user_id, project_id, x_service_event_type_id, user_priority)
		VALUES (DEFAULT, v_user_id, v_project_id, v_x_service_event_type_id, in_user_priority)
		RETURNING subscription_id,
			user_id,
			project_id,
			in_event_type_key AS event_type,
			user_priority
	),
	SEL AS (
		SELECT i.subscription_id AS "subscriptionId",
				u.email AS "userEmail",
				p.project_name AS "projectName",
				i.event_type AS "eventType",
				i.user_priority AS "userPriority",
				jsonb_object_agg(
					uc.contact_type, uc.contact_ref
				) AS "contacts"
		FROM INS i
		JOIN public.user_contact uc
				ON uc.user_contact_id = ANY(v_user_contact_id_list)
		JOIN public.user u
				ON u.user_id = i.user_id
		JOIN public.project p
				ON p.project_id = i.project_id
		GROUP BY 1, 2, 3, 4, 5
	)
	SELECT s.*,
			sk.keyword_list AS "keywordList"
	FROM SEL s
	-- sorts keyword_list
	JOIN LATERAL (
		SELECT array_agg(x) AS keyword_list
		FROM (
			SELECT unnest(in_keyword_name_list) AS x
			ORDER BY x ASC
		) AS _
	) sk ON true
	INTO v_result;

	FOREACH v_curr_keyword_id IN ARRAY v_keyword_id_list
	LOOP
		INSERT INTO public.x_subscription_keyword (subscription_id, keyword_id)
		VALUES (v_result."subscriptionId", v_curr_keyword_id);
	END LOOP;

	FOREACH v_curr_user_contact_id IN ARRAY v_user_contact_id_list
	LOOP
		INSERT INTO public.x_subscription_user_contact (subscription_id, user_contact_id)
		VALUES (v_result."subscriptionId", v_curr_user_contact_id);
	END LOOP;
	
	RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_subscription(
	in_user_email text,
	in_project_name text,
	in_event_type_key public.service_event_type -- GITLAB_COMMIT_CREATED, GITLAB_ISSUE_CREATED, ...
)
RETURNS SETOF public.subscription_denormalized_type
LANGUAGE plpgsql
COST 1
VOLATILE
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_project_id BIGINT;
DECLARE v_event_type_id BIGINT;
DECLARE v_result public.subscription_denormalized_type;
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;

	-- Check that the project associated with the project name `in_project_name` exists.
	-- If it doesn't, 'PROJECT_NOT_FOUND' is thrown.
	SELECT p.project_id
	FROM public.project p
	WHERE p.project_name = in_project_name
	INTO v_project_id;
	
	IF v_project_id IS NULL THEN
		RAISE EXCEPTION 'PROJECT_NOT_FOUND';
	END IF;

	-- Check that the event type identified by `in_event_type_key` exists.
	-- If it doesn't, 'EVENT_TYPE_NOT_FOUND' is thrown.
	SELECT e.event_type_id
	FROM public.event_type e
	WHERE e.event_type_key = in_event_type_key
	INTO v_event_type_id;
	
	IF v_event_type_id IS NULL THEN
		RAISE EXCEPTION 'EVENT_TYPE_NOT_FOUND';
	END IF;
	
	RETURN QUERY
	SELECT s.subscription_id AS "subscriptionId",
			u.email::text AS "userEmail",
			p.project_name::text AS "projectName",
			et.event_type_key AS "eventType",
			s.user_priority AS "userPriority",
			suc.contacts,
			sk.keyword_list::text[] AS "keywordList"
	FROM public.subscription s
	JOIN public.user u
			ON u.user_id = s.user_id
	JOIN public.project p
			ON p.project_id = s.project_id
	JOIN public.x_service_event_type xse
		ON xse.x_service_event_type_id = s.x_service_event_type_id
	JOIN public.event_type et
		ON et.event_type_id = xse.event_type_id
	JOIN LATERAL (
		-- sorts keyword_list
		SELECT array_agg(k.keyword_name ORDER BY k.keyword_name ASC)::text[] AS keyword_list
		FROM public.x_subscription_keyword xsk
		JOIN public.keyword k
			ON k.keyword_id = xsk.keyword_id
		WHERE xsk.subscription_id = s.subscription_id
	) sk ON true
	JOIN LATERAL (
		SELECT jsonb_object_agg(
			uc.contact_type, uc.contact_ref
		) AS contacts
		FROM public.x_subscription_user_contact xsuc
		JOIN public.user_contact uc
			ON uc.user_contact_id = xsuc.user_contact_id
		WHERE xsuc.subscription_id = s.subscription_id
	) suc ON true
	WHERE u.user_id = v_user_id
		AND p.project_id = v_project_id
		AND et.event_type_key = in_event_type_key;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_subscriptions_by_email(in_user_email text)
RETURNS SETOF public.subscription_denormalized_type
LANGUAGE plpgsql
COST 100
VOLATILE
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;
	
	RETURN QUERY
	SELECT s.subscription_id AS "subscriptionId",
			u.email::text AS "userEmail",
			p.project_name::text AS "projectName",
			et.event_type_key AS "eventType",
			s.user_priority AS "userPriority",
			suc.contacts AS "contacts",
			sk.keyword_list::text[] AS "keywordList"
	FROM public.subscription s
	JOIN public.user u
			ON u.user_id = s.user_id
	JOIN public.project p
			ON p.project_id = s.project_id
	JOIN public.x_service_event_type xse
		ON xse.x_service_event_type_id = s.x_service_event_type_id
	JOIN public.event_type et
		ON et.event_type_id = xse.event_type_id
	JOIN LATERAL (
		-- sorts keyword_list
		SELECT array_agg(k.keyword_name ORDER BY k.keyword_name ASC) AS keyword_list
		FROM public.x_subscription_keyword xsk
		JOIN public.keyword k
			ON k.keyword_id = xsk.keyword_id
		WHERE xsk.subscription_id = s.subscription_id
	) sk ON true
	JOIN LATERAL (
		SELECT jsonb_object_agg(
			uc.contact_type, uc.contact_ref
		) AS contacts
		FROM public.x_subscription_user_contact xsuc
		JOIN public.user_contact uc
			ON uc.user_contact_id = xsuc.user_contact_id
		WHERE xsuc.subscription_id = s.subscription_id
	) suc ON true
	WHERE u.user_id = v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_subscription(
	in_user_email text,
	in_project_name text,
	in_event_type_key public.service_event_type, -- GITLAB_COMMIT_CREATED, GITLAB_ISSUE_CREATED, ...
	in_user_priority public.user_priority DEFAULT NULL,
	in_contact_type_list public.consumer_service[] DEFAULT NULL, -- TELEGRAM, EMAIL, SLACK
	in_keyword_name_list text[] DEFAULT NULL
)
RETURNS public.subscription_denormalized_type
LANGUAGE plpgsql
COST 100
VOLATILE 
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_curr_contact_type public.consumer_service;
DECLARE v_user_contact_id_list BIGINT[];
DECLARE v_curr_user_contact_id BIGINT;
DECLARE v_project_id BIGINT;
DECLARE v_event_type_id BIGINT;
DECLARE v_x_service_event_type_id BIGINT;
DECLARE v_subscription_id BIGINT;
DECLARE v_result public.subscription_denormalized_type;
DECLARE v_curr_keyword_name text;
DECLARE v_curr_keyword_name_upper text;
DECLARE v_curr_keyword_id BIGINT;
DECLARE v_keyword_id_list BIGINT[];
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;
	
	-- Check that the project associated with the project name `in_project_name` exists.
	-- If it doesn't, 'PROJECT_NOT_FOUND' is thrown.
	SELECT p.project_id
	FROM public.project p
	WHERE p.project_name = in_project_name
	INTO v_project_id;
	
	IF v_project_id IS NULL THEN
		RAISE EXCEPTION 'PROJECT_NOT_FOUND';
	END IF;
	
	-- Check that the event type identified by `in_event_type_key` exists.
	-- If it doesn't, 'EVENT_TYPE_NOT_FOUND' is thrown.
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
	
	-- Sets v_subscription_id to the current subscription id
	SELECT subscription_id
	FROM public.subscription
	WHERE user_id = v_user_id
		AND project_id = v_project_id
		AND x_service_event_type_id = v_x_service_event_type_id
	INTO v_subscription_id;

	-- Populates v_user_contact_id_list with the list of user contact ids for the current subscription
	IF in_contact_type_list IS NULL THEN
		-- in_contact_type_list is null, so v_user_contact_id_list must be populated taking into
		-- consideration the already existing user contacts for the current subscription.
		-- Populates v_user_contact_id_list with the ids of the previous user contacts.
		SELECT array_agg(user_contact_id)
		FROM public.x_subscription_user_contact
		WHERE subscription_id = v_subscription_id
		INTO v_user_contact_id_list;
	ELSE
		v_user_contact_id_list = array[]::BIGINT[];
		-- Check that every contact type in the list is associated with the user
		-- identified by `v_user_id`. If it doesn't, 'CONTACT_NOT_FOUND' is thrown.
		FOREACH v_curr_contact_type IN ARRAY in_contact_type_list
		LOOP
			SELECT xuc.user_contact_id
			FROM public.user_contact xuc
			WHERE xuc.user_id = v_user_id
				AND xuc.contact_type = v_curr_contact_type
			INTO v_curr_user_contact_id;

			IF v_curr_user_contact_id IS NULL THEN
				RAISE EXCEPTION 'CONTACT_NOT_FOUND';
			END IF;

			-- pushes `v_curr_user_contact_id` into the array `v_user_contact_id_list`
			v_user_contact_id_list = v_user_contact_id_list || v_curr_user_contact_id;
			v_curr_user_contact_id = NULL; -- resets v_curr_user_contact_id
		END LOOP;

		-- The previously existing user contact associations with the current subscription should be overridden.
		DELETE
		FROM public.x_subscription_user_contact
		WHERE subscription_id = v_subscription_id;

		-- Creates the new user contact associations.
		FOREACH v_curr_user_contact_id IN ARRAY v_user_contact_id_list
		LOOP
			INSERT INTO public.x_subscription_user_contact (subscription_id, user_contact_id)
			VALUES (v_subscription_id, v_curr_user_contact_id);
		END LOOP;
	END IF;

	RAISE LOG 'user_contact_id_list: %', v_user_contact_id_list;
	RAISE LOG 'project_id: %', v_project_id;
	RAISE LOG 'event_type_id: %', v_event_type_id;
	RAISE LOG 'x_service_event_type_id: %', v_x_service_event_type_id;
	
	IF in_keyword_name_list IS NULL THEN
		-- Populates in_keyword_name_list with the ids of the previous keywords for the current subscription.
		SELECT array_agg(k.keyword_name ORDER BY k.keyword_name)
		FROM public.x_subscription_keyword xk
		JOIN public.keyword k
			ON k.keyword_id = xk.keyword_id
		WHERE xk.subscription_id = v_subscription_id
		INTO in_keyword_name_list;
	ELSE
		v_keyword_id_list = array[]::text[];
		-- Check that every contact type in the list is associated with the user
		-- identified by `v_user_id`. If it doesn't, 'CONTACT_NOT_FOUND' is thrown.

		-- The following block ensures that for keywords that already exists, the previous ids are used,
		-- and for keywords that didn't, a new record in `public.keyword` is created.
		FOREACH v_curr_keyword_name IN ARRAY in_keyword_name_list
		LOOP
			v_curr_keyword_name_upper = UPPER(v_curr_keyword_name);

			SELECT k.keyword_id
			FROM public.keyword k
			WHERE k.keyword_name = v_curr_keyword_name_upper
			INTO v_curr_keyword_id;

			IF v_curr_keyword_id IS NULL THEN
				INSERT INTO public.keyword (keyword_id, keyword_name)
				VALUES (DEFAULT, v_curr_keyword_name_upper)
				RETURNING keyword_id INTO v_curr_keyword_id;
			END IF;

			-- pushes `v_curr_keyword_id` into the array `v_keyword_id_list`
			v_keyword_id_list = v_keyword_id_list || v_curr_keyword_id;
			v_curr_keyword_id = NULL; -- resets v_curr_keyword_id
		END LOOP;

		RAISE LOG 'keyword_id_list: %', v_keyword_id_list;

		-- The previously existing keyword associations with the current subscription should be overridden.
		DELETE
		FROM public.x_subscription_keyword
		WHERE subscription_id = v_subscription_id;

		-- Creates the new keyword associations.
		FOREACH v_curr_keyword_id IN ARRAY v_keyword_id_list
		LOOP
			INSERT INTO public.x_subscription_keyword (subscription_id, keyword_id)
			VALUES (v_subscription_id, v_curr_keyword_id);
		END LOOP;
	END IF;

	WITH PATCH_PARAMS AS (
		SELECT v_subscription_id AS subscription_id,
			v_user_id AS user_id,
			v_project_id AS project_id,
			v_x_service_event_type_id AS x_service_event_type_id,
			in_user_priority AS user_priority -- NULLABLE
	),
	UPD AS (
		UPDATE public.subscription AS s
		SET user_priority = COALESCE(p.user_priority, s.user_priority)
		FROM PATCH_PARAMS p
    WHERE s.subscription_id = p.subscription_id
		RETURNING s.subscription_id,
			s.user_id,
			s.project_id,
			in_event_type_key AS event_type,
			s.user_priority
	),
	GROUP_UPD AS (
		SELECT s.subscription_id AS "subscriptionId",
				u.email AS "userEmail",
				p.project_name AS "projectName",
				s.event_type AS "eventType",
				s.user_priority AS "userPriority",
				jsonb_object_agg(
					uc.contact_type, uc.contact_ref
				) AS "contacts"
		FROM UPD s
		JOIN public.user_contact uc
				ON uc.user_contact_id = ANY(v_user_contact_id_list)
		JOIN public.user u
				ON u.user_id = s.user_id
		JOIN public.project p
				ON p.project_id = s.project_id
		GROUP BY 1, 2, 3, 4, 5
	)
	SELECT s.*,
		sk.keyword_list AS "keywordList"
	FROM GROUP_UPD s
	-- sorts keyword_list
	JOIN LATERAL (
		SELECT array_agg(x) AS keyword_list
		FROM (
			SELECT unnest(in_keyword_name_list) AS x
			ORDER BY x ASC
		) AS _
	) sk ON true
	INTO v_result;
	
	RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_subscription(
	in_user_email text,
	in_project_name text,
	in_event_type_key public.service_event_type -- GITLAB_COMMIT_CREATED, GITLAB_ISSUE_CREATED, ...
)
RETURNS INT
LANGUAGE plpgsql
COST 1
VOLATILE
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_project_id BIGINT;
DECLARE v_event_type_id BIGINT;
DECLARE v_x_service_event_type_id BIGINT;
DECLARE v_result INT;
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;

	-- Check that the project associated with the project name `in_project_name` exists.
	-- If it doesn't, 'PROJECT_NOT_FOUND' is thrown.
	SELECT p.project_id
	FROM public.project p
	WHERE p.project_name = in_project_name
	INTO v_project_id;
	
	IF v_project_id IS NULL THEN
		RAISE EXCEPTION 'PROJECT_NOT_FOUND';
	END IF;

	-- Check that the event type identified by `in_event_type_key` exists.
	-- If it doesn't, 'EVENT_TYPE_NOT_FOUND' is thrown.
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

	WITH DEL AS (
		DELETE
		FROM public.subscription
		WHERE user_id = v_user_id
			AND project_id = v_project_id
			AND x_service_event_type_id = v_x_service_event_type_id
			RETURNING *
	)
	SELECT COUNT(*)::INT
	FROM DEL
	INTO v_result;

	RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_update_modified_field()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.modified = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_event_receivers(in_event_record json, in_save_event boolean DEFAULT false)
RETURNS TABLE (
	"userContactList" json
)
LANGUAGE plpgsql
COST 100
VOLATILE 
AS $$
#variable_conflict use_variable
DECLARE v_producer_service public.producer_service; -- REDMINE, GITLAB, SLACK
DECLARE v_project_name text;
DECLARE v_project_url text;
DECLARE v_event_id text;
DECLARE v_event_type_key public.service_event_type; -- GITLAB_COMMIT_CREATED, GITLAB_ISSUE_CREATED, ...
DECLARE v_user_email text; -- the email of the user that created the event
DECLARE v_title text; -- the title of the event
DECLARE v_description text; -- the description of the event
DECLARE v_tag_list text[]; -- the list of tags of the event
DECLARE v_result json;
BEGIN
  RAISE LOG 'in_event_record: %', in_event_record;

  v_producer_service = in_event_record->>'service';
  v_project_name = in_event_record->>'projectName';
  v_project_url = in_event_record->>'projectURL';
  v_event_id = in_event_record->>'eventId';
  v_event_type_key = in_event_record->>'eventType';
  v_user_email = in_event_record->>'userEmail';
  v_title = in_event_record->>'title';
  v_description = in_event_record->>'description';
  v_tag_list = ARRAY(SELECT * FROM json_array_elements_text(in_event_record->'tags'));

  IF in_save_event THEN
    INSERT INTO public.event_sent_log (producer_service_key, event_record)
    VALUES (v_producer_service, in_event_record::jsonb);
  END IF;

	RETURN QUERY
	-- Record object as it arrives from the Middleware Dispatcher service
  WITH EVENT_RECORD AS (
		SELECT NOW() AS timestamp,
			v_producer_service AS service,
			v_project_name AS project_name,
			v_project_url AS project_url,
			v_event_id AS event_id,
			v_event_type_key AS event_type,
			v_user_email AS user_email,
			v_title AS title,
			v_description AS description,
			v_tag_list AS tags
	),
	-- Returns the single project that match the event's project
	EVENT_PROJECT AS (
		SELECT p.project_id,
			p.project_name
		FROM public.project p,
			EVENT_RECORD r
		WHERE p.project_url @> ('{"' || r.service::text || '": "' || r.project_url || '"}')::jsonb
			OR p.project_name = r.project_name
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
	-- Returns the list of subscription that are related to the project and event type mentioned
	-- in the event record
	SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT AS (
		SELECT s.*
		FROM public.v_filtered_users vfu
		JOIN EVENT_PROJECT p ON TRUE
		JOIN EVENT_TYPE_ID eti ON TRUE
		JOIN public.subscription s
			ON s.user_id = vfu.user_id
			AND s.project_id = p.project_id
			AND s.x_service_event_type_id = eti.x_service_event_type_id
	),
	-- Returns the distinct list of keywords that appear in the subscriptions found
	-- in SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT
	KEYWORDS_FOR_SAME_SUBSCRIPTIONS AS (
		SELECT DISTINCT k.keyword_name,
			s.user_id
		FROM SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT s
		JOIN public.x_subscription_keyword xsk
			ON xsk.subscription_id = s.subscription_id
		JOIN public.x_subscription_user_contact xsuc
			ON xsuc.subscription_id = s.subscription_id
		JOIN public.keyword k
			ON k.keyword_id = xsk.keyword_id
		JOIN public.user_contact xuc
			ON xuc.user_contact_id = xsuc.user_contact_id
		-- excludes the event creator
		WHERE NOT EXISTS(
			SELECT *
			FROM public.v_filtered_users u,
				EVENT_RECORD r
			WHERE u.user_id = s.user_id
				AND u.email = r.user_email
		)
	),
	-- Finds all the keywords defined in the subscriptions that are linked to the current
	-- project and event type. For each keyword, it also returns the list of filtered users 
	-- that have specified said keyword.
	KEYWORD_USERS_MAP AS (
		SELECT ku.keyword_name,
			array_agg(ku.user_id) AS user_id_list
		FROM KEYWORDS_FOR_SAME_SUBSCRIPTIONS ku
		GROUP BY ku.keyword_name
	),
	-- Filters KEYWORD_USERS_MAP, returning only those keywords which appear either in the event
	-- title, description or tags. This word matching is case unsensitive.
	SEARCH_KEYWORDS_IN_RECORD AS (
		SELECT kg.keyword_name,
			kg.user_id_list
		FROM KEYWORD_USERS_MAP kg
		JOIN EVENT_RECORD r ON true
		WHERE r.description ILIKE '%' || kg.keyword_name || '%'
			OR r.title ILIKE '%' || kg.keyword_name || '%'
			OR kg.keyword_name ILIKE ANY(r.tags)
	),
	-- Returns the users that have specified at least one of the keywords that appear in SEARCH_KEYWORDS_IN_RECORD.
	-- For each user, a count stating the number of keyword matches is returned.
	KEYWORD_MATCHES_GROUPED_BY_USER AS (
		-- this cast is needed otherwise I can't join later
		SELECT CAST(u AS BIGINT) as user_id,
			COUNT(*) AS n_keyword_match_occurs
		FROM SEARCH_KEYWORDS_IN_RECORD,
			unnest(user_id_list) AS u
		GROUP BY 1
	),
	-- Performs a ranking considering the user priority and the number of keyword matches for each user
	-- found in KEYWORD_MATCHES_GROUPED_BY_USER. The higher the user priority and the number of matches,
	-- the lower the rank (i.e. the better the rank).
	USER_MATCHES_RANKED AS (
		SELECT km.user_id,
			RANK () OVER (
				ORDER BY km.n_keyword_match_occurs DESC,
						s.user_priority DESC
			) AS rank
		FROM KEYWORD_MATCHES_GROUPED_BY_USER km
		JOIN SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT s
			ON s.user_id = km.user_id
		ORDER BY rank
	),
	-- Returns the users with the best rank among the ones selected in USER_MATCHES_RANKED.
	BEST_USER_MATCHES AS (
		SELECT umr.user_id
		FROM USER_MATCHES_RANKED umr
		GROUP BY umr.user_id
		-- HAVING MIN(umr.rank) = 1
	),
	-- For each user, it returns the contact info related to the matched user's subscription.
	-- The contact info is represented as a map, which has the contact service as key and the
	-- contact identified as value.
	USER_CONTACT_INFO AS (
		SELECT u.firstname,
			u.lastname,
			jsonb_object_agg(
				uc.contact_type, uc.contact_ref
			) AS "contacts"
		FROM BEST_USER_MATCHES bum
		JOIN SUBSCRIPTIONS_TO_SAME_PROJECT_EVENT s
			ON s.user_id = bum.user_id
		JOIN public.x_subscription_user_contact xsuc
			ON xsuc.subscription_id = s.subscription_id
		JOIN public.user_contact uc
			ON uc.user_contact_id = xsuc.user_contact_id
		JOIN v_filtered_users u
			ON u.user_id = uc.user_id
		GROUP BY u.firstname,
			u.lastname
	)
	SELECT COALESCE(
		json_agg(row_to_json(uci.*)),
		'[]'::json
	) AS "userContactList"
	FROM USER_CONTACT_INFO uci;

END;
$$;


DROP TYPE IF EXISTS public.user_contact_denormalized_type CASCADE;
CREATE TYPE public.user_contact_denormalized_type AS (
	"userContactId" BIGINT,
	"userEmail" text,
	"contactService" public.consumer_service,
	"contactRef" text
);

CREATE OR REPLACE FUNCTION public.create_user_contact(
	in_user_email text,
	in_contact_type public.consumer_service,
	in_contact_ref text
)
RETURNS public.user_contact_denormalized_type
LANGUAGE plpgsql
COST 2
VOLATILE
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_result public.user_contact_denormalized_type;
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;

	INSERT INTO public.user_contact (user_id, contact_type, contact_ref)
	VALUES (v_user_id, in_contact_type, in_contact_ref)
	RETURNING user_contact_id AS "userContactId",
		in_user_email AS "userEmail",
		contact_type AS "contactService",
		contact_ref AS "contactRef"
	INTO v_result;

	RETURN v_result;

END;
$$;


CREATE OR REPLACE FUNCTION public.delete_user(in_user_email text)
RETURNS INT
LANGUAGE sql
AS $$
	WITH DEL AS (
		DELETE
		FROM public.user
		WHERE email = in_user_email
		RETURNING *
	)
	SELECT COUNT(*)::INT
	FROM DEL;
$$;


CREATE OR REPLACE FUNCTION public.delete_project(in_project_name text)
RETURNS INT
LANGUAGE sql
AS $$
	WITH DEL AS (
		DELETE
		FROM public.project
		WHERE project_name = in_project_name
		RETURNING *
	)
	SELECT COUNT(*)::INT
	FROM DEL;
$$;


CREATE OR REPLACE FUNCTION public.delete_user_contact(in_user_email text, in_contact_type public.consumer_service)
RETURNS INT
LANGUAGE plpgsql
COST 2
VOLATILE
AS $$
#variable_conflict use_variable
DECLARE v_user_id BIGINT;
DECLARE v_result INT;
BEGIN
	-- Check that the user associated with the user email `in_user_email` exists.
	-- If it doesn't, 'USER_NOT_FOUND' is thrown.
	SELECT u.user_id
	FROM public.user u
	WHERE u.email = in_user_email
	INTO v_user_id;
	
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'USER_NOT_FOUND';
	END IF;

	WITH DEL AS (
		DELETE
		FROM public.user_contact
		WHERE user_id = v_user_id
			AND contact_type = in_contact_type
		RETURNING *
	)
	SELECT COUNT(*)::INT
	FROM DEL
	INTO v_result;

	RETURN v_result;

END;
$$;

----------------- PROCEDURES -----------------

/*
 * `trunc_data()` deletes every data inserted by the user, keeping only the pre-configured table records
 * in `public.service`, `public.event_type` and `public.x_service_event_type`.
 */
CREATE OR REPLACE PROCEDURE public.trunc_data()
LANGUAGE plpgsql
AS $$
DECLARE
    truncate_query varchar;
BEGIN
    FOR truncate_query IN
			WITH ALL_USER_TABLES AS (
				SELECT schemaname,
					tablename,
					(schemaname || '.' || tablename) AS table_id
				FROM pg_catalog.pg_tables
				WHERE schemaname NOT LIKE 'pg_%'
								AND schemaname NOT LIKE ''
								AND schemaname != 'information_schema'
			)
			SELECT 'TRUNCATE ' || table_id || ' CASCADE;' AS truncate_query
			FROM ALL_USER_TABLES
			WHERE table_id NOT IN (
				'public.service',
				'public.event_type',
				'public.x_service_event_type'
			)
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

	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(10, 'GITLAB_COMMIT_CREATED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(11, 'GITLAB_ISSUE_CREATED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(12, 'GITLAB_ISSUE_EDITED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(13, 'GITLAB_MERGE_REQUEST_CREATED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(14, 'GITLAB_MERGE_REQUEST_EDITED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(15, 'GITLAB_MERGE_REQUEST_MERGED');
	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(16, 'GITLAB_MERGE_REQUEST_CLOSED');

	INSERT INTO public.event_type(event_type_id, event_type_key) VALUES(20, 'SONARQUBE_PROJECT_ANALYSIS_COMPLETED');

	-- REDMINE event types
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (1, 1, 1);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (2, 1, 2);

	-- GITLAB event types
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (5, 2, 10);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (6, 2, 11);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (7, 2, 12);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (8, 2, 13);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (9, 2, 14);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (10, 2, 15);
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (11, 2, 16);

	-- SONARQUBE event types
	INSERT INTO public.x_service_event_type(x_service_event_type_id, service_id, event_type_id) VALUES (12, 3, 20);
END;
$$;

/*
`init_demo_data()` initializes the data needed for a demo presentation
*/
CREATE OR REPLACE PROCEDURE public.init_demo_data()
LANGUAGE plpgsql
AS $$
BEGIN
	INSERT INTO public.project(project_name, project_url) VALUES ('Butterfly', '{"REDMINE": "http://localhost:15000/issues/2", "GITLAB": "https://localhost:10443/dstack/butterfly"}');
	INSERT INTO public.project(project_name, project_url) VALUES ('Amazon', '{"GITLAB": "gitlab.amazon.com/amazon/amazon.git"}');
	INSERT INTO public.project(project_name, project_url) VALUES ('Uber', '{"GITLAB": "gitlab.uber.com/uber/uber.git"}');
	INSERT INTO public.project(project_name, project_url) VALUES ('Twitter', '{"SONARQUBE": "sonarqube.twitter.com/twitter/twitter.git", "GITLAB": "gitlab.twitter.com/twitter/twitter.git"}');

	INSERT INTO public.user(email, firstname, lastname) VALUES ('alberto.schiabel@gmail.com', 'Alberto', 'Schiabel');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('federico.rispo@gmail.com', 'Federico', 'Rispo');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('enrico.trinco@gmail.com', 'Enrico', 'Trinco');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('TheAlchemist97@gmail.com', 'Niccolò', 'Vettorello');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('eleonorasignor@gmail.com', 'Eleonora', 'Signor');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('elton97@gmail.com', 'Elton', 'Stafa');
	INSERT INTO public.user(email, firstname, lastname) VALUES ('singh@gmail.com', 'Harwinder', 'Singh');

	-- PERFORM is used when we're not interesting in the actual data returned from the called stored function.
	PERFORM public.create_user_contact('alberto.schiabel@gmail.com', 'TELEGRAM', '38442289');
	PERFORM public.create_user_contact('alberto.schiabel@gmail.com', 'SLACK', 'jkomyno');
	PERFORM public.create_user_contact('alberto.schiabel@gmail.com', 'EMAIL', 'dstackgroup@gmail.com');
	PERFORM public.create_user_contact('federico.rispo@gmail.com', 'TELEGRAM', 'frispo');
	PERFORM public.create_user_contact('federico.rispo@gmail.com', 'EMAIL', 'dstackgroup@gmail.com');
	PERFORM public.create_user_contact('enrico.trinco@gmail.com', 'TELEGRAM', 'enrico_dogen');
	PERFORM public.create_user_contact('enrico.trinco@gmail.com', 'EMAIL', 'dstackgroup@gmail.com');
	PERFORM public.create_user_contact('TheAlchemist97@gmail.com', 'TELEGRAM', '191751378');
	PERFORM public.create_user_contact('TheAlchemist97@gmail.com', 'EMAIL', 'dstackgroup@gmail.com');

  PERFORM public.create_subscription('alberto.schiabel@gmail.com', 'Butterfly', 'GITLAB_ISSUE_CREATED', 'MEDIUM', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{BUG, FIX, CLOSE}'::text[]);
  PERFORM public.create_subscription('alberto.schiabel@gmail.com', 'Butterfly', 'REDMINE_TICKET_CREATED', 'LOW', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{BUG, DOGE}'::text[]);
	PERFORM public.create_subscription('TheAlchemist97@gmail.com', 'Butterfly', 'GITLAB_ISSUE_CREATED', 'MEDIUM', '{EMAIL}'::public.consumer_service[], '{DOGE, BREAK, VSCODE}'::text[]);
	PERFORM public.create_subscription('TheAlchemist97@gmail.com', 'Butterfly', 'GITLAB_ISSUE_EDITED', 'MEDIUM', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{DOGE, BREAK, BUG}'::text[]);

  -- PERFORM public.create_subscription('alberto.schiabel@gmail.com', 'Butterfly', 'GITLAB_COMMIT_CREATED', 'LOW', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{BUG, FIX, CLOSE}'::text[]);
	-- PERFORM public.create_subscription('alberto.schiabel@gmail.com', 'Butterfly', 'GITLAB_ISSUE_CREATED', 'LOW', '{TELEGRAM}'::public.consumer_service[], '{BUG}'::text[]);
	-- PERFORM public.create_subscription('alberto.schiabel@gmail.com', 'Butterfly', 'REDMINE_TICKET_CREATED', 'LOW', '{TELEGRAM}'::public.consumer_service[], '{PROJECT, BUG, DEADLINE}'::text[]);
	-- PERFORM public.create_subscription('federico.rispo@gmail.com', 'Amazon', 'GITLAB_ISSUE_CREATED', 'LOW', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{FIX, BUG, RESOLVE}'::text[]);
	-- PERFORM public.create_subscription('federico.rispo@gmail.com', 'Amazon', 'GITLAB_ISSUE_EDITED', 'LOW', '{TELEGRAM}'::public.consumer_service[], '{FIX, BUG, RESOLVE}'::text[]);
	-- PERFORM public.create_subscription('enrico.trinco@gmail.com', 'Amazon', 'GITLAB_ISSUE_CREATED', 'MEDIUM', '{TELEGRAM}'::public.consumer_service[], '{FIX, STRANGE}'::text[]);
	-- PERFORM public.create_subscription('TheAlchemist97@gmail.com', 'Amazon', 'GITLAB_ISSUE_CREATED', 'MEDIUM', '{TELEGRAM, EMAIL}'::public.consumer_service[], '{FIX, STRANGE, BUG}'::text[]);
END;
$$;

------------------ TRIGGER ------------------

CREATE TRIGGER update_project_timestamp
BEFORE UPDATE ON public.project
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_update_modified_field();

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON public.user
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_update_modified_field();

------------------ EXECUTE ------------------

CALL public.trunc_data();
CALL public.init_event_data();
CALL public.init_demo_data();


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
	WHERE uwp.project_url @> ('{"' || r.service::text || '": "' || r.project_url || '"}')::jsonb
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
	JOIN public.user_contact xuc
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
