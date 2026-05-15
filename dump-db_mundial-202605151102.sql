CREATE FUNCTION public.actualizar_updated_at() RETURNS trigger
    LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.validar_formacion_grupo() RETURNS trigger
    LANGUAGE plpgsql AS $$
DECLARE
    total_equipos INTEGER;
    equipos_asignados INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_equipos FROM equipos WHERE estado = TRUE;
    SELECT COUNT(*) INTO equipos_asignados FROM formacion_grupos WHERE grupo_id = NEW.grupo_id AND estado = TRUE;
    equipos_asignados := equipos_asignados + 1;
    IF equipos_asignados >= total_equipos THEN
        RAISE EXCEPTION 'No se puede formar un grupo con todos los equipos';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TABLE public.equipos (
    id BIGSERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL,
    codigo_fifa CHAR(3) NOT NULL,
    director_tecnico VARCHAR(100) NOT NULL,
    ranking_fifa INTEGER NOT NULL,
    cantidad_jugadores INTEGER NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_equipos_nombre_pais UNIQUE(nombre_pais),
    CONSTRAINT uq_equipos_codigo_fifa UNIQUE(codigo_fifa),
    CONSTRAINT chk_codigo_fifa CHECK (codigo_fifa ~ '^[A-Z]{3}$'),
    CONSTRAINT chk_ranking_fifa CHECK (ranking_fifa > 0),
    CONSTRAINT chk_cantidad_jugadores CHECK (cantidad_jugadores BETWEEN 23 AND 26)
);

CREATE TABLE public.grupos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_grupos_nombre UNIQUE(nombre)
);

CREATE TABLE public.formacion_grupos (
    id BIGSERIAL PRIMARY KEY,
    grupo_id BIGINT NOT NULL,
    equipo_id BIGINT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_formacion_grupo FOREIGN KEY (grupo_id) REFERENCES grupos(id),
    CONSTRAINT fk_formacion_equipo FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    CONSTRAINT uq_equipo_un_grupo UNIQUE(equipo_id),
    CONSTRAINT uq_grupo_equipo UNIQUE(grupo_id, equipo_id)
);

CREATE TRIGGER trg_equipos_updated_at BEFORE UPDATE ON equipos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();
CREATE TRIGGER trg_grupos_updated_at BEFORE UPDATE ON grupos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();
CREATE TRIGGER trg_formacion_grupos_updated_at BEFORE UPDATE ON formacion_grupos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();
CREATE TRIGGER trg_validar_formacion_grupo BEFORE INSERT ON formacion_grupos FOR EACH ROW EXECUTE FUNCTION public.validar_formacion_grupo();

CREATE INDEX idx_formacion_grupo_id ON public.formacion_grupos(grupo_id);
CREATE INDEX idx_formacion_equipo_id ON public.formacion_grupos(equipo_id);

INSERT INTO equipos (nombre_pais, codigo_fifa, director_tecnico, ranking_fifa, cantidad_jugadores)
VALUES
('Argentina', 'ARG', 'Lionel Scaloni', 1, 26),
('Brasil', 'BRA', 'Dorival Júnior', 5, 26),
('España', 'ESP', 'Luis de la Fuente', 3, 25),
('Mexico', 'MEX', 'Javier Aguirre', 15, 26);

INSERT INTO grupos (nombre, descripcion)
VALUES
('Grupo A', 'Grupo principal A'),
('Grupo B', 'Grupo principal B');