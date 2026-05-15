--
-- PostgreSQL database dump
--

\restrict Hj9PBR6117X2V3STa8Ratz4rnMB76IHmpZfqWn1vaP0YbnaWSLBYSc5SGHp6NdS

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-15 11:02:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 225 (class 1255 OID 17341)
-- Name: actualizar_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_updated_at() OWNER TO postgres;

--
-- TOC entry 226 (class 1255 OID 17345)
-- Name: validar_formacion_grupo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_formacion_grupo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_equipos INTEGER;
    equipos_asignados INTEGER;
BEGIN

    -- Total equipos activos
    SELECT COUNT(*)
    INTO total_equipos
    FROM equipos
    WHERE estado = TRUE;

    -- Equipos asignados al grupo actual
    SELECT COUNT(*)
    INTO equipos_asignados
    FROM formacion_grupos
    WHERE grupo_id = NEW.grupo_id
      AND estado = TRUE;

    -- Se suma el nuevo registro
    equipos_asignados := equipos_asignados + 1;

    -- Validación
    IF equipos_asignados >= total_equipos THEN
        RAISE EXCEPTION
        'No se puede formar un grupo con todos los equipos';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_formacion_grupo() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 17267)
-- Name: equipos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipos (
    id bigint NOT NULL,
    nombre_pais character varying(100) NOT NULL,
    codigo_fifa character(3) NOT NULL,
    director_tecnico character varying(100) NOT NULL,
    ranking_fifa integer NOT NULL,
    cantidad_jugadores integer NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_cantidad_jugadores CHECK (((cantidad_jugadores >= 23) AND (cantidad_jugadores <= 26))),
    CONSTRAINT chk_codigo_fifa CHECK ((codigo_fifa ~ '^[A-Z]{3}$'::text)),
    CONSTRAINT chk_ranking_fifa CHECK ((ranking_fifa > 0))
);


ALTER TABLE public.equipos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17266)
-- Name: equipos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipos_id_seq OWNER TO postgres;

--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 219
-- Name: equipos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipos_id_seq OWNED BY public.equipos.id;


--
-- TOC entry 224 (class 1259 OID 17312)
-- Name: formacion_grupos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formacion_grupos (
    id bigint NOT NULL,
    grupo_id bigint NOT NULL,
    equipo_id bigint NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.formacion_grupos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17311)
-- Name: formacion_grupos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formacion_grupos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formacion_grupos_id_seq OWNER TO postgres;

--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 223
-- Name: formacion_grupos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formacion_grupos_id_seq OWNED BY public.formacion_grupos.id;


--
-- TOC entry 222 (class 1259 OID 17293)
-- Name: grupos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grupos (
    id bigint NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.grupos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17292)
-- Name: grupos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grupos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grupos_id_seq OWNER TO postgres;

--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 221
-- Name: grupos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grupos_id_seq OWNED BY public.grupos.id;


--
-- TOC entry 4868 (class 2604 OID 17270)
-- Name: equipos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos ALTER COLUMN id SET DEFAULT nextval('public.equipos_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 17315)
-- Name: formacion_grupos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos ALTER COLUMN id SET DEFAULT nextval('public.formacion_grupos_id_seq'::regclass);


--
-- TOC entry 4872 (class 2604 OID 17296)
-- Name: grupos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos ALTER COLUMN id SET DEFAULT nextval('public.grupos_id_seq'::regclass);


--
-- TOC entry 5055 (class 0 OID 17267)
-- Dependencies: 220
-- Data for Name: equipos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipos (id, nombre_pais, codigo_fifa, director_tecnico, ranking_fifa, cantidad_jugadores, estado, created_at, updated_at) FROM stdin;
2	Brasil	BRA	Dorival Júnior	5	26	t	2026-05-15 08:46:15.766804	2026-05-15 08:46:15.766804
3	España	ESP	Luis de la Fuente	3	25	t	2026-05-15 08:46:15.766804	2026-05-15 08:46:15.766804
4	Mexico	MEX	Javier Aguirre	15	26	t	2026-05-15 10:08:39.769543	2026-05-15 10:08:39.769543
1	Argentina	ARG	Lionel Scaloni	10	25	t	2026-05-15 08:46:15.766804	2026-05-15 10:09:40.499586
\.


--
-- TOC entry 5059 (class 0 OID 17312)
-- Dependencies: 224
-- Data for Name: formacion_grupos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formacion_grupos (id, grupo_id, equipo_id, estado, created_at, updated_at) FROM stdin;
3	1	3	t	2026-05-15 10:10:18.390197	2026-05-15 10:10:18.390197
4	1	1	t	2026-05-15 10:10:18.390197	2026-05-15 10:10:18.390197
5	2	4	t	2026-05-15 10:10:18.390197	2026-05-15 10:10:18.390197
6	2	2	t	2026-05-15 10:10:18.390197	2026-05-15 10:10:18.390197
\.


--
-- TOC entry 5057 (class 0 OID 17293)
-- Dependencies: 222
-- Data for Name: grupos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grupos (id, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
1	Grupo A	Grupo principal A	t	2026-05-15 08:46:15.766804	2026-05-15 08:46:15.766804
2	Grupo B	Grupo principal B	t	2026-05-15 08:46:15.766804	2026-05-15 08:46:15.766804
\.


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 219
-- Name: equipos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipos_id_seq', 4, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 223
-- Name: formacion_grupos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formacion_grupos_id_seq', 6, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 221
-- Name: grupos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grupos_id_seq', 2, true);


--
-- TOC entry 4884 (class 2606 OID 17287)
-- Name: equipos equipos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 17326)
-- Name: formacion_grupos formacion_grupos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos
    ADD CONSTRAINT formacion_grupos_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 17308)
-- Name: grupos grupos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos
    ADD CONSTRAINT grupos_pkey PRIMARY KEY (id);


--
-- TOC entry 4898 (class 2606 OID 17328)
-- Name: formacion_grupos uq_equipo_un_grupo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos
    ADD CONSTRAINT uq_equipo_un_grupo UNIQUE (equipo_id);


--
-- TOC entry 4886 (class 2606 OID 17291)
-- Name: equipos uq_equipos_codigo_fifa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT uq_equipos_codigo_fifa UNIQUE (codigo_fifa);


--
-- TOC entry 4888 (class 2606 OID 17289)
-- Name: equipos uq_equipos_nombre_pais; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT uq_equipos_nombre_pais UNIQUE (nombre_pais);


--
-- TOC entry 4900 (class 2606 OID 17330)
-- Name: formacion_grupos uq_grupo_equipo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos
    ADD CONSTRAINT uq_grupo_equipo UNIQUE (grupo_id, equipo_id);


--
-- TOC entry 4892 (class 2606 OID 17310)
-- Name: grupos uq_grupos_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos
    ADD CONSTRAINT uq_grupos_nombre UNIQUE (nombre);


--
-- TOC entry 4895 (class 1259 OID 17348)
-- Name: idx_formacion_equipo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_formacion_equipo_id ON public.formacion_grupos USING btree (equipo_id);


--
-- TOC entry 4896 (class 1259 OID 17347)
-- Name: idx_formacion_grupo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_formacion_grupo_id ON public.formacion_grupos USING btree (grupo_id);


--
-- TOC entry 4903 (class 2620 OID 17342)
-- Name: equipos trg_equipos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_equipos_updated_at BEFORE UPDATE ON public.equipos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 4905 (class 2620 OID 17344)
-- Name: formacion_grupos trg_formacion_grupos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_formacion_grupos_updated_at BEFORE UPDATE ON public.formacion_grupos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 4904 (class 2620 OID 17343)
-- Name: grupos trg_grupos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_grupos_updated_at BEFORE UPDATE ON public.grupos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 4906 (class 2620 OID 17346)
-- Name: formacion_grupos trg_validar_formacion_grupo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_formacion_grupo BEFORE INSERT ON public.formacion_grupos FOR EACH ROW EXECUTE FUNCTION public.validar_formacion_grupo();


--
-- TOC entry 4901 (class 2606 OID 17336)
-- Name: formacion_grupos fk_formacion_equipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos
    ADD CONSTRAINT fk_formacion_equipo FOREIGN KEY (equipo_id) REFERENCES public.equipos(id);


--
-- TOC entry 4902 (class 2606 OID 17331)
-- Name: formacion_grupos fk_formacion_grupo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formacion_grupos
    ADD CONSTRAINT fk_formacion_grupo FOREIGN KEY (grupo_id) REFERENCES public.grupos(id);


-- Completed on 2026-05-15 11:02:40

--
-- PostgreSQL database dump complete
--

\unrestrict Hj9PBR6117X2V3STa8Ratz4rnMB76IHmpZfqWn1vaP0YbnaWSLBYSc5SGHp6NdS

