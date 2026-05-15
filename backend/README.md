# 🌍 Mundial API

API REST para administrar equipos y grupos del Mundial de Fútbol. Permite el CRUD de equipos y grupos, y la generación aleatoria de formación de grupos.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura por capas](#arquitectura-por-capas)
- [Endpoints](#endpoints)
  - [Equipos](#equipos)
  - [Grupos](#grupos)
  - [Formación de grupos](#formación-de-grupos)
- [Validaciones](#validaciones)
- [Códigos de error](#códigos-de-error)
- [Formato de respuestas](#formato-de-respuestas)
- [Documentación Swagger](#documentación-swagger)
- [Seguridad](#seguridad)

---

## Tecnologías

| Paquete | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express | ^5.x | Framework HTTP |
| pg | ^8.x | Driver PostgreSQL |
| express-validator | ^7.x | Validación de entradas |
| swagger-ui-express | ^5.x | Documentación interactiva |
| swagger-jsdoc | ^6.x | Generación de spec OpenAPI |
| helmet | ^8.x | Headers de seguridad HTTP |
| cors | ^2.x | Control de CORS |
| morgan | ^1.x | Logging de peticiones |
| dotenv | ^17.x | Variables de entorno |
| nodemon | ^3.x | Recarga automática (dev) |

---

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 13 o superior
- npm 9 o superior

---

## Instalación y configuración

```bash
# 1. Clonar o descomprimir el proyecto
cd prueba

# 2. Instalar dependencias backend
cd backend 

npm install

# 3. Crear el archivo de variables de entorno
cp .env

# 4. Editar .env con tus credenciales (ver sección Variables de entorno)

# 5. Instalar dependencias y librerias necesarias
npm install express pg dotenv express-validator swagger-ui-express swagger-jsdoc cors helmet morgan

npm install --save-dev nodemon

# 6. Ejecutar el script SQL en PostgreSQL para crear tablas, triggers e índices
psql -U postgres -d db_mundial -f database.sql

# 7. Arrancar en modo desarrollo
npm run dev

# Arrancar en producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundial_db
DB_USER=postgres
DB_PASSWORD=tu_password
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto donde escucha el servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) | `development` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | — |
| `DB_USER` | Usuario de PostgreSQL | — |
| `DB_PASSWORD` | Contraseña de PostgreSQL | — |


---

## Base de datos

El proyecto utiliza PostgreSQL con las siguientes tablas:

### `equipos`
Almacena los equipos participantes del mundial.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | BIGSERIAL PK | Identificador único |
| `nombre_pais` | VARCHAR(100) | Nombre del país (único) |
| `codigo_fifa` | CHAR(3) | Código FIFA en mayúsculas (único, ej: ARG) |
| `director_tecnico` | VARCHAR(100) | Nombre del DT |
| `ranking_fifa` | INTEGER | Posición en el ranking FIFA (> 0) |
| `cantidad_jugadores` | INTEGER | Entre 23 y 26 |
| `estado` | BOOLEAN | `true` = activo, `false` = eliminado lógicamente |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última modificación |

### `grupos`
Almacena los grupos del torneo.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | BIGSERIAL PK | Identificador único |
| `nombre` | VARCHAR(10) | Nombre del grupo (único, ej: Grupo A) |
| `descripcion` | TEXT | Descripción opcional |
| `estado` | BOOLEAN | `true` = activo |
| `created_at` / `updated_at` | TIMESTAMP | Auditoría |

### `formacion_grupos`
Tabla de relación entre grupos y equipos (asignación aleatoria).

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | BIGSERIAL PK | Identificador único |
| `grupo_id` | BIGINT FK | Referencia a `grupos.id` |
| `equipo_id` | BIGINT FK | Referencia a `equipos.id` |
| `estado` | BOOLEAN | `true` = activo |

**Constraints de BD relevantes:**
- Un equipo solo puede pertenecer a un grupo (`uq_equipo_un_grupo`)
- No puede repetirse el mismo equipo en el mismo grupo (`uq_grupo_equipo`)
- El código FIFA debe ser exactamente 3 letras mayúsculas (`chk_codigo_fifa`)
- El ranking FIFA debe ser positivo (`chk_ranking_fifa`)
- Los jugadores deben estar entre 23 y 26 (`chk_cantidad_jugadores`)

---

## Estructura del proyecto

```
mundial-api/
├── src/
│   ├── config/
│   │   ├── db.js                   # Pool de conexiones PostgreSQL
│   │   └── swagger.js              # Configuración OpenAPI / Swagger
│   │
│   ├── models/                     # Capa de acceso a datos (solo SQL parametrizado)
│   │   ├── equipo.model.js
│   │   ├── grupo.model.js
│   │   └── formacion.model.js
│   │
│   ├── services/                   # Lógica de negocio
│   │   ├── equipos.service.js
│   │   ├── grupos.service.js
│   │   └── formacion.service.js
│   │
│   ├── controllers/                # Gestión HTTP (req → service → res)
│   │   ├── equipos.controller.js
│   │   ├── grupos.controller.js
│   │   └── formacion.controller.js
│   │
│   ├── routes/                     # Definición de endpoints
│   │   ├── equipos.routes.js
│   │   ├── grupos.routes.js
│   │   ├── formacion.routes.js
│   │   └── index.js                # Barrel: monta todos los routers bajo /api/v1
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js         # Manejo centralizado de errores
│   │   ├── validate.js             # Procesa resultados de express-validator
│   │   └── notFound.js             # Catch-all para rutas inexistentes (404)
│   │
│   ├── validations/                # Reglas de express-validator
│   │   ├── equipo.validation.js
│   │   ├── grupo.validation.js
│   │   └── formacion.validation.js
│   │
│   ├── utils/
│   │   ├── AppError.js             # Clase de error tipificado
│   │   ├── errorCodes.js           # Catálogo de códigos E001–E015
│   │   ├── asyncHandler.js         # Wrapper async para controllers
│   │   └── shuffle.js              # Algoritmo Fisher-Yates
│   │
│   ├── app.js                      # Configuración de Express
│   └── server.js                   # Punto de entrada
│
├── .env                            # Variables de entorno (no versionar)
├── .env.example                    # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## Arquitectura por capas

El proyecto sigue una arquitectura en capas con responsabilidad única:

```
Request
  │
  ▼
[ route ]        → Define URL + método HTTP
  │
  ▼
[ validation ]   → Verifica formato de campos (express-validator)
  │
  ▼
[ controller ]   → Recibe req, llama al service, devuelve res
  │
  ▼
[ service ]      → Aplica reglas de negocio (unicidad, divisibilidad, etc.)
  │
  ▼
[ model ]        → Ejecuta SQL parametrizado contra PostgreSQL
  │
  ▼
PostgreSQL
  │
  ▼ (en caso de error)
[ errorHandler ] → Respuesta JSON unificada
```

**Regla estricta:** Ningún `pool.query()` existe fuera de la carpeta `models/`. Ninguna lógica de negocio existe fuera de `services/`.

---

## Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

---

### Equipos

#### `GET /equipos`
Lista todos los equipos activos ordenados por ranking FIFA.

**Respuesta exitosa `200`:**
```json
{
  "status": "success",
  "total": 3,
  "data": [
    {
      "id": 1,
      "nombre_pais": "Argentina",
      "codigo_fifa": "ARG",
      "director_tecnico": "Lionel Scaloni",
      "ranking_fifa": 1,
      "cantidad_jugadores": 26,
      "estado": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Validaciones de negocio (service — capa de lógica)

Se ejecutan después de pasar el formato. Responden `409` o `400`:

| Validación | Código | HTTP |
|---|---|---|
| País duplicado | E001 | 409 |
| Código FIFA duplicado | E002 | 409 |
| Nombre de grupo duplicado | E006 | 409 |
| Cantidad de grupos > grupos en BD | E008 | 400 |
| Equipos no divisibles entre grupos | E009 | 400 |
| Solo 1 grupo solicitado | E010 / E012 | 400 |
| Equipos insuficientes | E011 | 400 |

### Validaciones de formación de grupos (reglas completas)

1. **Mínimo 2 grupos** — no se puede generar con `cantidadGrupos < 2`.
2. **No superar grupos en BD** — si hay 8 grupos registrados, no se puede pedir 9.
3. **Divisibilidad exacta** — si hay 32 equipos y se piden 5 grupos, la API rechaza (32 % 5 ≠ 0). No deben quedar equipos sin asignar.
4. **Equipos suficientes** — debe haber al menos 2 equipos por grupo.
5. **No un solo grupo con todos** — validación adicional contra el trigger de PostgreSQL.

---

## Códigos de error

| Código | Descripción | HTTP |
|---|---|---|
| `E001` | El nombre del país ya está registrado | 409 |
| `E002` | El código FIFA ya está registrado | 409 |
| `E003` | El código FIFA debe tener exactamente 3 letras mayúsculas | 422 |
| `E004` | El ranking FIFA debe ser un número entero positivo | 422 |
| `E005` | La cantidad de jugadores debe estar entre 23 y 26 | 422 |
| `E006` | El nombre del grupo ya está registrado | 409 |
| `E007` | Grupo no encontrado | 404 |
| `E008` | La cantidad de grupos supera los registrados en BD | 400 |
| `E009` | Los equipos no son divisibles entre la cantidad de grupos | 400 |
| `E010` | No se puede formar un solo grupo con todos los equipos | 400 |
| `E011` | No hay suficientes equipos registrados | 400 |
| `E012` | Debe solicitar al menos 2 grupos | 400 |
| `E013` | Ruta no encontrada | 404 |
| `E014` | Error interno del servidor | 500 |
| `E015` | Equipo no encontrado | 404 |

---

## Formato de respuestas

Todas las respuestas siguen una estructura JSON consistente:

### Éxito
```json
{
  "status": "success",
  "message": "Descripción opcional de la acción",
  "data": { }
}
```

### Error operacional
```json
{
  "status": "error",
  "errorCode": "E001",
  "message": "El nombre del país ya está registrado"
}
```

### Error de validación (422)
```json
{
  "status": "error",
  "message": "Error de validación",
  "errors": [
    { "field": "nombreCampo", "message": "Descripción del error" }
  ]
}
```

### Health check
```
GET /health
```
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Documentación Swagger

La documentación interactiva OpenAPI 3.0 está disponible mientras el servidor esté corriendo:

```
http://localhost:3000/api/docs
```

Desde Swagger UI puedes explorar todos los endpoints, ver los schemas de request/response y ejecutar peticiones de prueba directamente desde el navegador.

---

## Seguridad

| Medida | Implementación | Descripción |
|---|---|---|
| SQL parametrizado | `pg` driver | Todos los valores van como `$1`, `$2`… separados del SQL. Previene SQL injection. |
| Validación de entradas | `express-validator` | Rechaza tipos incorrectos y formatos inválidos antes de tocar la BD. |
| Headers seguros | `helmet` | Configura automáticamente headers HTTP de seguridad (CSP, X-Frame-Options, etc.). |
| CORS | `cors` | Controla qué orígenes pueden acceder a la API. |
| Borrado lógico | `estado = FALSE` | Los registros nunca se eliminan físicamente. Permite auditoría y recuperación. |
| Errores no expuestos | `errorHandler.js` | En producción, los errores inesperados devuelven un mensaje genérico sin stack trace. |
| Constraints en BD | PostgreSQL `CHECK` | Segunda línea de defensa: valida datos aunque se bypass la capa de Node.js. |
| Transacciones | `BEGIN / COMMIT / ROLLBACK` | La formación de grupos se persiste atómicamente. Si falla cualquier inserción, se revierte todo. |