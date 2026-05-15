# 🌐 Mundial API — Frontend

Interfaz web para administrar equipos y grupos del Mundial de Fútbol. Consume la [Mundial API REST](../backend/README.md) y permite el CRUD completo de equipos y grupos, así como la generación aleatoria de formación de grupos.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación y uso](#instalación-y-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos](#módulos)
  - [Inicio](#inicio)
  - [Equipos](#equipos)
  - [Grupos](#grupos)
  - [Formación](#formación)
- [Componentes](#componentes)
- [Arquitectura JavaScript](#arquitectura-javascript)
- [Estilos y animaciones](#estilos-y-animaciones)
- [Configuración de la API](#configuración-de-la-api)
- [Solución de problemas](#solución-de-problemas)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de las páginas |
| CSS3 | Estilos, variables CSS, diseño responsivo |
| JavaScript ES6+ | Lógica de módulos, fetch API, manipulación del DOM |
| Google Fonts — Inter | Tipografía principal |

Sin frameworks, sin bundlers, sin dependencias de npm. Funciona directamente en el navegador.

---

## Requisitos previos

- El backend (Mundial API) corriendo en `http://localhost:3000`
- Un navegador moderno (Chrome, Firefox, Edge, Safari)
- Opcional: un servidor local para evitar restricciones CORS con `file://`

---

## Instalación y uso

El frontend no requiere instalación. Solo copia la carpeta y ábrela:

```
prueba/
├── backend/    ← API REST (Node.js)
└── frontend/   ← Este proyecto
```

### Opción A — Abrir directamente (más simple)

Abre `frontend/index.html` directamente en el navegador. Si el backend tiene CORS habilitado sin restricciones (configuración por defecto), funcionará sin problemas.

### Opción B — Servidor local (recomendado)

Evita cualquier restricción de `file://` y simula un entorno real:

```bash
# Navegar a la carpeta

cd frontend

# Con Node.js (sin instalar nada extra)
npx serve .

# Con Python
python -m http.server 8080 --directory frontend

# Con VS Code
# Instala la extensión "Live Server" y haz clic en "Go Live"
```

Luego abre `http://localhost:3000` (o el puerto que indique el servidor).

> ⚠️ Asegúrate de que el backend esté corriendo antes de abrir el frontend.

---

## Estructura del proyecto

```
frontend/
├── index.html                      # Página principal (dashboard)
│
├── pages/
│   ├── equipos.html                # Módulo CRUD de equipos
│   ├── grupos.html                 # Módulo CRUD de grupos
│   └── formacion.html             # Módulo de formación aleatoria
│
└── assets/
    ├── css/
    │   ├── main.css               # Variables, reset, layout, navegación
    │   ├── components.css         # Botones, tablas, modales, formularios, badges
    │   └── animations.css         # Fade-up, spinner, toast, keyframes
    │
    └── js/
        ├── api/
        │   └── client.js          # Capa de comunicación con el backend
        │
        ├── components/
        │   ├── spinner.js         # Overlay de carga global
        │   ├── toast.js           # Notificaciones con auto-dismiss
        │   ├── modal.js           # Modal reutilizable y diálogo de confirmación
        │   └── table.js           # Renderizador dinámico de tablas
        │
        ├── modules/
        │   ├── equipos.js         # Lógica completa del módulo equipos
        │   ├── grupos.js          # Lógica completa del módulo grupos
        │   └── formacion.js       # Lógica del módulo de formación
        │
        └── app.js                 # Punto de entrada y detección de página
```

---

## Módulos

### Inicio

`index.html` — Dashboard principal con tres secciones:

- **Contadores en vivo** — muestra la cantidad de equipos registrados, grupos configurados y grupos en la formación activa. Los datos se cargan automáticamente al abrir la página.
- **Acceso rápido** — botones directos a cada módulo.
- **Flujo de trabajo** — guía visual en 3 pasos para orientar al usuario.

---

### Equipos

`pages/equipos.html` — CRUD completo de equipos participantes.

**Funcionalidades:**
- Tabla con todos los equipos activos ordenados por ranking FIFA
- Botón **Nuevo Equipo** abre el modal de creación
- Botón ✏️ por fila abre el modal de edición con datos precargados
- Botón 🗑️ por fila solicita confirmación antes de eliminar
- Contador de equipos en el encabezado actualizado en tiempo real

**Campos del formulario:**

| Campo | Tipo | Validación |
|---|---|---|
| Nombre del país | Texto | Requerido, máx. 100 caracteres, único |
| Código FIFA | Texto | Exactamente 3 letras, se convierte a mayúsculas automáticamente |
| Director Técnico | Texto | Requerido, máx. 100 caracteres |
| Ranking FIFA | Número | Entero mayor a 0 |
| Cantidad de jugadores | Número | Entre 23 y 26 |

---

### Grupos

`pages/grupos.html` — CRUD completo de grupos del torneo.

**Funcionalidades:**
- Tabla con todos los grupos activos ordenados alfabéticamente
- Botón **Nuevo Grupo** abre el modal de creación
- Botón ✏️ por fila abre el modal de edición con datos precargados
- Botón 🗑️ por fila solicita confirmación antes de eliminar

**Campos del formulario:**

| Campo | Tipo | Validación |
|---|---|---|
| Nombre | Texto | Requerido, máx. 10 caracteres, único (ej: Grupo A) |
| Descripción | Texto | Opcional |

---

### Formación

`pages/formacion.html` — Generación aleatoria de distribución de equipos en grupos.

**La pantalla está dividida en tres secciones:**

**1. Paneles informativos**
- Panel izquierdo: lista todos los equipos registrados con código FIFA y ranking
- Panel derecho: lista todos los grupos disponibles con su descripción

**2. Configuración**
- Campo numérico para indicar cuántos grupos se desean formar (mínimo 2, máximo igual al total de grupos en BD)
- Botón **Generar asignación** — ejecuta la distribución aleatoria en el backend
- Botón **Ver formación actual** — carga y muestra la última formación guardada en BD

**3. Vista previa**
- Aparece después de generar con animación de entrada
- Muestra cada grupo en una card con sus equipos asignados
- Botón **Regenerar** para volver a generar con los mismos u otros parámetros

> La formación se guarda automáticamente en base de datos al generarse. Cada nueva generación reemplaza la anterior.

---

## Componentes

### `Spinner`

Overlay global con fondo semitransparente y efecto blur. Se muestra durante cualquier petición a la API.

```js
Spinner.show();   // Muestra el overlay
Spinner.hide();   // Oculta el overlay
```

---

### `Toast`

Notificaciones no intrusivas en la esquina superior derecha con auto-dismiss.

```js
Toast.success('Equipo creado correctamente');     // Verde — 3.5s
Toast.error('El código FIFA ya está registrado'); // Rojo — 4.5s
Toast.warning('No hay formación guardada');       // Amarillo — 4s
```

---

### `Modal`

Maneja apertura, cierre y animación de modales. Incluye diálogo de confirmación para acciones destructivas.

```js
Modal.open('equipo-modal');    // Abre modal por ID
Modal.close('equipo-modal');   // Cierra modal por ID
Modal.closeAll();              // Cierra todos los modales abiertos

Modal.confirm({
  title: 'Eliminar equipo',
  message: '¿Estás seguro?',
  onConfirm: () => eliminar(id),
});
```

---

### `Table`

Renderiza tablas HTML dinámicamente a partir de datos y una definición de columnas.

```js
Table.render({
  containerId: 'equipos-table',
  columns: [
    { label: 'País',   key: 'nombre_pais' },
    { label: 'Estado', render: row => row.estado ? 'Activo' : 'Inactivo' },
  ],
  data: equipos,
  emptyMessage: 'No hay equipos registrados',
});
```

Cada columna puede usar `key` para acceso directo o `render` para HTML personalizado.

---

## Arquitectura JavaScript

Todos los módulos usan el patrón **IIFE** (Immediately Invoked Function Expression) para encapsular el estado y exponer solo la API pública:

```js
const EquiposModule = (() => {
  let equipos = [];          // Estado privado

  async function load() { } // Función privada
  function _render() { }    // Convención: _ = privado

  function init() { }       // API pública

  return { init, openEdit, remove };
})();
```

**Flujo de carga de una página:**

```
DOMContentLoaded
      │
      ▼
   App.init()
      │
      ├── _detectPage()    ← Lee el nombre del archivo HTML
      ├── _setActiveNav()  ← Marca el enlace activo en la nav
      └── Module.init()    ← Inicializa el módulo correspondiente
```

`app.js` detecta la página automáticamente por el nombre del archivo y llama al módulo correcto. No hace falta configuración manual al agregar nuevas páginas.

---

## Estilos y animaciones

### Variables CSS

Todos los colores, espaciados y sombras están definidos en `:root` dentro de `main.css`:

```css
:root {
  --color-primary:       #2563eb;
  --color-success:       #16a34a;
  --color-danger:        #dc2626;
  --color-warning:       #d97706;
  --color-bg:            #f8fafc;
  --color-surface:       #ffffff;
  --color-border:        #e2e8f0;
  --color-text:          #1e293b;
  --color-text-muted:    #64748b;
  --radius-md:           8px;
  --shadow-sm:           0 1px 3px rgba(0,0,0,.08);
  --transition:          200ms ease;
}
```

### Animaciones

El efecto **fade-up** se aplica automáticamente a las filas de tabla al renderizarse, con un retraso escalonado por fila para dar sensación de carga progresiva:

```css
tbody tr:nth-child(1)  { animation-delay: 30ms;  }
tbody tr:nth-child(2)  { animation-delay: 60ms;  }
tbody tr:nth-child(3)  { animation-delay: 90ms;  }
/* ... hasta 10 filas */
```

Las cards de formación también entran con fade-up escalonado configurable por JavaScript:

```js
style="animation-delay:${i * 60}ms"
```

### Diseño responsivo

Puntos de quiebre definidos en `main.css`:

| Breakpoint | Cambio |
|---|---|
| ≤ 768px | Grid de 2 columnas → 1 columna |
| ≤ 768px | Labels del nav se ocultan (solo iconos) |
| ≤ 768px | Modal ocupa ancho completo |
| ≤ 768px | Panel de formación pasa a columna única |

---

## Configuración de la API

La URL base del backend está definida en `assets/js/api/client.js`:

```js
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

Para apuntar a otro entorno (staging, producción), cambia únicamente esta línea.

El objeto `client` expone cuatro métodos que centralizan todo el manejo de errores HTTP:

```js
client.get('/equipos')
client.post('/equipos', payload)
client.put('/equipos/1', payload)
client.delete('/equipos/1')
```

Todos los métodos lanzan un `Error` enriquecido cuando la respuesta no es `2xx`, con las propiedades `statusCode`, `errorCode` y `errors` para que los módulos puedan manejar cada caso específico.

---

## Solución de problemas

**El navegador bloquea las peticiones al backend**

Ocurre al abrir el HTML con `file://`. Usa un servidor local:

```bash
npx serve frontend
```

**Error de CORS en la consola**

Verifica que el backend tenga el middleware `cors()` activo en `app.js` y que esté corriendo en `http://localhost:3000`.

**Las tablas aparecen vacías sin mensaje de error**

Abre las herramientas de desarrollador (F12) → pestaña **Console** y **Network**. Verifica que las peticiones a `/api/v1/equipos` y `/api/v1/grupos` devuelvan `200 OK`.

**El spinner no desaparece**

Indica que una petición falló silenciosamente. Revisa la consola del navegador para ver el error exacto.

**Los estilos no cargan**

Verifica que las rutas relativas de los CSS sean correctas según desde dónde abres el archivo. Las páginas dentro de `pages/` usan `../assets/css/` mientras que `index.html` usa `assets/css/`.