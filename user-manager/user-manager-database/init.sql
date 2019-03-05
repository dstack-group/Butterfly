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

CREATE SEQUENCE public.service_id_seq;
CREATE TABLE public.service (
  service_id BIGINT NOT NULL DEFAULT nextval('public.service_id_seq'),
  producer_service_key public.producer_service NOT NULL,
  CONSTRAINT service_pkey PRIMARY KEY (service_id),
  CONSTRAINT service_id_producer_service_key_unique UNIQUE (service_id, producer_service_key)
);

CREATE SEQUENCE public.event_type_id_seq;
CREATE TABLE public.event_type (
  event_type_id BIGINT NOT NULL DEFAULT nextval('public.event_type_id_seq'),
  event_type_key public.service_event_type NOT NULL,
  CONSTRAINT event_type_pkey PRIMARY KEY (event_type_id),
  CONSTRAINT event_type_id_event_type_key_unique UNIQUE (event_type_id, event_type_key)
);

CREATE SEQUENCE public.x_service_event_type_id_seq;
CREATE TABLE public.x_service_event_type (
  x_service_event_type_id BIGINT NOT NULL DEFAULT nextval('public.x_service_event_type_id_seq'),
  service_id BIGINT NOT NULL,
  event_type_id BIGINT NOT NULL,
  CONSTRAINT x_service_event_type_pkey PRIMARY KEY (x_service_event_type_id),
  CONSTRAINT x_service_id_event_type_id_unique UNIQUE (service_id, event_type_id),
  CONSTRAINT x_service_event_type_service_fkey
    FOREIGN KEY (service_id)
    REFERENCES public.service (service_id),
  CONSTRAINT x_service_event_type_event_type_fkey
    FOREIGN KEY (event_type_id)
    REFERENCES public.event_type (event_type_id)
);

CREATE SEQUENCE public.project_id_seq;
CREATE TABLE public.project (
  project_id BIGINT NOT NULL DEFAULT nextval('public.project_id_seq'),
  project_name VARCHAR(30) NOT NULL UNIQUE,
  project_url jsonb,
  CONSTRAINT project_pkey PRIMARY KEY (project_id)
);
ALTER SEQUENCE public.project_id_seq OWNED BY public.project.project_id;

CREATE SEQUENCE public.user_id_seq;
CREATE TABLE public.user (
  user_id BIGINT NOT NULL DEFAULT nextval('public.user_id_seq'),
  username VARCHAR(16) NOT NULL UNIQUE, -- TODO: to remove
  email VARCHAR(30) NOT NULL UNIQUE,
  firstname VARCHAR(30) NOT NULL,
  lastname VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL, -- TODO: for the future
  enabled BOOLEAN DEFAULT true NOT NULL,
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  modified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (user_id)
);
ALTER SEQUENCE public.user_id_seq OWNED BY public.user.user_id;

CREATE TABLE public.x_user_service_event_type (
  user_id BIGINT NOT NULL,
  x_service_event_type_id BIGINT NOT NULL,
  CONSTRAINT x_user_service_event_type_pkey PRIMARY KEY (user_id, x_service_event_type_id),
  CONSTRAINT x_user_service_event_type_user_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id),
  CONSTRAINT x_user_service_event_type_x_service_event_type_fkey
    FOREIGN KEY (x_service_event_type_id)
    REFERENCES public.x_service_event_type (x_service_event_type_id)
);

CREATE TABLE public.x_user_contact (
  user_id BIGINT NOT NULL,
  contact_type public.consumer_service NOT NULL,
  contact_ref VARCHAR(30) NOT NULL,
  -- contact_url VARCHAR(255) DEFAULT NULL, 
  CONSTRAINT x_user_contact_pkey PRIMARY KEY (user_id, contact_type),
  CONSTRAINT x_user_contact_user_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id)
);

CREATE TABLE public.x_user_project (
  user_id BIGINT NOT NULL,
  project_id BIGINT NOT NULL,
  CONSTRAINT x_user_project_pkey PRIMARY KEY (user_id, project_id),
  CONSTRAINT x_user_project_user_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id),
  CONSTRAINT x_user_project_project_fkey
    FOREIGN KEY (project_id)
    REFERENCES public.project (project_id)
);

CREATE TABLE public.keywords (
  keyword varchar(15) NOT NULL,
  user_id BIGINT NOT NULL,
  CONSTRAINT keywords_pkey PRIMARY KEY (keyword, user_id),
  CONSTRAINT keywords_user_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.user (user_id)
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
    REFERENCES public.user (user_id),
  CONSTRAINT event_sent_log_event_type_fkey
    FOREIGN KEY (event_type_id)
    REFERENCES public.event_type (event_type_id),
  CONSTRAINT event_sent_log_project_fkey
    FOREIGN KEY (project_id)
    REFERENCES public.project (project_id)
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
DROP VIEW IF EXISTS public.v_filtered_users CASCADE;
CREATE VIEW public.v_filtered_users AS (
  SELECT DISTINCT
    u.user_id,
    u.email,
    u.firstname,
    u.lastname
  FROM public.user u
  JOIN public.x_user_project xup
    ON xup.user_id = u.user_id
  JOIN public.x_user_contact xuc
    ON xuc.user_id = u.user_id
  JOIN public.x_user_service_event_type xuset
    ON xuset.user_id = u.user_id
  JOIN public.keywords k
    ON k.user_id = u.user_id
  WHERE u.enabled = TRUE
);

DROP VIEW IF EXISTS public.v_filtered_users_project CASCADE;
CREATE VIEW public.v_filtered_users_project AS (
  SELECT u.*,
    p.project_id,
    p.project_name,
    p.project_url
  FROM public.v_filtered_users u
  JOIN public.x_user_project xup ON xup.user_id = u.user_id
  JOIN public.project p ON p.project_id = xup.project_id
);

----------------- INSERT ------------------

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

-- jkomyno is interested into REDMINE_TICKET_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (1, 1);

-- jkomyno is interested into GITLAB_COMMIT_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (1, 5);

-- jkomyno is interested into GITLAB_ISSUE_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (1, 6);

-- jkomyno is interested into GITLAB_ISSUE_EDITED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (1, 7);

-- federicorispo is interested into GITLAB_COMMIT_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (2, 5);

-- federicorispo is interested into SONARQUBE_PROJECT_ANALYSIS_COMPLETED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (2, 8);

-- Dogemist is interested into GITLAB_COMMIT_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (3, 5);

-- Dogemist is interested into GITLAB_ISSUE_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (3, 6);

-- elton97 is interested into SONARQUBE_PROJECT_ANALYSIS_COMPLETED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (6, 8);

-- singh is interested into REDMINE_TICKET_EDITED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (7, 2);

-- singh is interested into GITLAB_ISSUE_CREATED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (7, 6);

-- singh is interested into GITLAB_ISSUE_EDITED
INSERT INTO public.x_user_service_event_type(user_id, x_service_event_type_id) VALUES (7, 7);

INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'TELEGRAM', 'jkomyno');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'SLACK', 'jkomyno');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (1, 'EMAIL', 'dstackgroup@gmail.com');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (2, 'TELEGRAM', 'frispo');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (2, 'EMAIL', 'dstackgroup@gmail.com');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (3, 'TELEGRAM', 'enrico_dogen');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (3, 'EMAIL', 'dstackgroup@gmail.com');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (4, 'TELEGRAM', 'mrossi');
INSERT INTO public.x_user_contact(user_id, contact_type, contact_ref) VALUES (4, 'EMAIL', 'dstackgroup@gmail.com');

INSERT INTO public.x_user_project(user_id, project_id) VALUES (1, 1);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (1, 2);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (2, 1);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (3, 1);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (3, 2);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (3, 3);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (4, 2);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (4, 3);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (5, 1);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (5, 2);
INSERT INTO public.x_user_project(user_id, project_id) VALUES (5, 3);

INSERT INTO public.keywords(keyword, user_id) VALUES ('bug', 1);
INSERT INTO public.keywords(keyword, user_id) VALUES ('fix', 1);
INSERT INTO public.keywords(keyword, user_id) VALUES ('performance', 1);
INSERT INTO public.keywords(keyword, user_id) VALUES ('enhance', 1);

INSERT INTO public.keywords(keyword, user_id) VALUES ('bug', 2);
INSERT INTO public.keywords(keyword, user_id) VALUES ('revert', 2);
INSERT INTO public.keywords(keyword, user_id) VALUES ('clean', 2);

INSERT INTO public.keywords(keyword, user_id) VALUES ('performance', 3);
INSERT INTO public.keywords(keyword, user_id) VALUES ('enhance', 3);

INSERT INTO public.keywords(keyword, user_id) VALUES ('bug', 5);
INSERT INTO public.keywords(keyword, user_id) VALUES ('revert', 5);
INSERT INTO public.keywords(keyword, user_id) VALUES ('clean', 5);

/*
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

SET row_security = on;
SET check_function_bodies = true;