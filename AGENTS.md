# AGENTS.md — Guía para Agentes en FluxDev Blog

Guía operativa y técnica para agentes de Inteligencia Artificial que colaboren en el desarrollo, mantenimiento y optimización del proyecto **FluxDev Blog**.

---

## 1. Visión General del Proyecto

**FluxDev Blog** es una plataforma web moderna y estática (SSG) con capacidades dinámicas en el edge, diseñada para la divulgación de artículos técnicos, guías y contenido sobre desarrollo de software, frontend, backend y productividad.

* **Propósito:** Ofrecer una experiencia de lectura ultrarrápida, accesible y multilingüe (español e inglés), con búsqueda de texto completo del lado del cliente vía WebAssembly (Pagefind), sistema interactivo de comentarios serverless respaldado por SQLite en el edge y protección anti-bots mediante Cloudflare Turnstile.
* **Dominio en Producción:** [https://fluxdev-nebula.mgdc.site/](https://fluxdev-nebula.mgdc.site/)
* **Repositorio:** [https://github.com/ivndv/fluxdev-blog](https://github.com/ivndv/fluxdev-blog)

---

## 2. Antes de Tocar Código

* **Uso del MCP CodeGraph:** Antes de realizar búsquedas masivas de texto o explorar múltiples archivos a ciegas, invoca la herramienta `codegraph_explore` para inspeccionar el flujo de llamadas, blast radius y el código fuente verbatim de los símbolos en una sola llamada eficiente.
* **Estado y Sincronización:**
  ```bash
  # Verificar el estado del índice de CodeGraph
  codegraph status /home/ivan/software-dev/fluxdev-blog

  # Sincronizar cambios en el árbol de archivos tras crear o renombrar módulos
  codegraph sync /home/ivan/software-dev/fluxdev-blog
  ```

---

## 3. Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Runtime & Gestor** | **Bun** | `v1.3.x` (`bun.lock`) |
| **Lenguaje** | **TypeScript** | `^7.0.2` (Modo estricto con `tsconfig.json`) |
| **Frontend & Framework** | **Astro 7** + **React 19** | `astro ^7.3.2`, `@astrojs/react ^6.0.5`, `react ^19.2.8` |
| **Estilos & UI** | **Tailwind CSS 4** | `@tailwindcss/vite ^4.3.3`, `@tailwindcss/typography ^0.5.20`, `@iconify/tailwind4 ^1.2.3` |
| **Fuentes** | **Fontsource Outfit** | `@fontsource/outfit ^5.3.0` (autoalojada) |
| **Estado Global** | **Zustand 5** | `zustand ^5.0.15` (gestión de comentarios y UI en `src/store/`) |
| **Motor de Búsqueda** | **Pagefind** | `pagefind ^1.5.2` (indexación estática post-build, búsqueda WASM cliente) |
| **Backend / Edge API** | **Hono 4** en Cloudflare Pages Functions | `hono ^4.13.7` (enrutamiento ligero en `functions/api/[[route]].ts`) |
| **Base de Datos** | **Cloudflare D1 (SQLite)** | Base de datos distribuida en el edge (`blog-comments`) |
| **Caché & Rate Limit** | **Cloudflare Workers KV** | KV namespace para caché de comentarios (TTL 300s) y límite de peticiones |
| **Anti-Bot / Captcha** | **Cloudflare Turnstile** | Validación server-side en Pages Function y widget cliente |
| **Validación de Datos** | **Zod 4** | `zod ^4.6.2` (esquema de validación en `functions/_shared/schema.ts`) |
| **Sanitización HTML** | **sanitize-html** | `sanitize-html ^2.17.7` (limpieza estricta de comentarios) |
| **SEO & RSS** | **Astro Sitemap & RSS** | `@astrojs/sitemap ^3.7.4`, `@astrojs/rss ^4.0.19`, Schema.org JSON-LD |
| **Internacionalización (i18n)** | **Astro i18n nativo** | Rutas `/` (español) y `/en/` (inglés), diccionarios en `src/i18n/ui.ts` |
| **Linter & Formatter** | **Biome 2** | `@biomejs/biome ^2.5.13` (`biome.jsonc` con preset `recommended`) |
| **Pruebas Unitarias** | **Vitest 5** | `vitest ^5.0.0` con entorno `jsdom` (8 tests de utilidades e i18n) |
| **CDN & Assets** | **Cloudflare R2** | Bucket unificado `assets-mgdc`, dominio `https://assets.mgdc.site/fluxdevblog/` |
| **Infraestructura Edge** | **Cloudflare Pages** | Despliegue estático global con Pages Functions integradas |

---

## 4. Estructura del Código

```
fluxdev-blog/
├── functions/                     → Backend Edge (Cloudflare Pages Functions)
│   ├── _shared/                   → Módulos compartidos del backend
│   │   ├── cache.ts               → Helpers de lectura, escritura e invalidación en KV (TTL 300s)
│   │   ├── db.ts                  → Consultas SQL a Cloudflare D1 (getComments, insertComment)
│   │   ├── rateLimit.ts           → Control de tasa por IP en KV (5 req / 60s)
│   │   ├── schema.ts              → Esquemas de validación Zod (CommentSchema)
│   │   └── turnstile.ts           → Verificación de token captcha contra API de Cloudflare
│   └── api/
│       └── [[route]].ts           → Entry point Hono con endpoints REST (/api/comments/:slug)
│
├── public/                        → Assets estáticos públicos directos
│   ├── _headers                   → Reglas de seguridad (CSP, HSTS) y caché por extensión
│   ├── favicon.svg                → Favicon vectorial primario
│   ├── llms.txt                   → Contexto estructurado para modelos de lenguaje
│   ├── manifest.json              → Manifiesto PWA de la aplicación
│   ├── robots.txt                 → Directivas para motores de búsqueda y rastreadores
│   └── sw.js                      → Service Worker de la aplicación
│
├── src/                           → Código fuente de la aplicación Astro + React
│   ├── components/                → Componentes modulares
│   │   ├── analytics/             → Integración de telemetría (UmamiAnalytics.astro)
│   │   ├── blog/                  → Componentes interactivos de comentarios (React)
│   │   │   ├── CommentCard.jsx    → Tarjeta visual con iniciales del autor y fecha
│   │   │   ├── CommentForm.jsx    → Formulario con validación y widget Turnstile
│   │   │   └── Comments.jsx       → Contenedor orquestador conectado a Zustand
│   │   ├── layout/                → Elementos de navegación y estructura
│   │   │   ├── BaseHead.astro     → Metadatos generales, fuentes y Open Graph
│   │   │   ├── LanguagePicker.jsx → Selector de idioma reactivo (ES / EN)
│   │   │   ├── MobileMenu.jsx     → Menú desplegable para dispositivos móviles
│   │   │   ├── Search.jsx         → Interfaz modal de búsqueda con Pagefind
│   │   │   ├── ShareButtons.jsx   → Botones para compartir artículos en redes
│   │   │   └── ThemeToggle.jsx    → Selector de tema (claro / oscuro / sistema)
│   │   └── seo/                   → Componentes de optimización SEO y JSON-LD
│   │       ├── JsonLd.astro       → Marcado semántico estructurado Schema.org
│   │       ├── MetaBase.astro     → Metatags canónicos, robots y viewport
│   │       ├── SeoValidator.ts    → Validador de consistencia de metadatos en desarrollo
│   │       └── SocialCards.astro  → Generación de Twitter Cards y Open Graph tags
│   │
│   ├── content/                   → Contenido editorial en Markdown
│   │   └── blog/                  → Artículos en español y subdirectorio /en/ en inglés
│   ├── hooks/                     → Hooks reutilizables (useTurnstile.js)
│   ├── i18n/                      → Diccionarios y utilidades de traducción (ui.ts, ui.test.ts)
│   ├── layouts/                   → Layouts base (Layout.astro, BlogPost.astro)
│   ├── pages/                     → Enrutamiento estático de Astro
│   │   ├── [...page].astro        → Página de inicio paginada (español)
│   │   ├── blog/[slug].astro      → Vista de detalle de artículo individual (español)
│   │   ├── etiquetas/[tag].astro  → Artículos filtrados por etiqueta (español)
│   │   ├── about.astro            → Página "Acerca de"
│   │   ├── rss.xml.js             → Feed RSS principal
│   │   ├── legal/                 → Términos y política de privacidad
│   │   └── en/                    → Rutas localizadas para inglés ([...page], blog, tags, about)
│   │
│   ├── store/                     → Gestión de estado global con Zustand
│   │   ├── store.js               → Store unificado
│   │   └── slices/                → commentsSlice.js (fetch, submit, estados de carga)
│   ├── styles/                    → Estilos globales (global.css con Tailwind 4)
│   ├── test/                      → Configuración de pruebas (setup.ts para Vitest)
│   └── utils/                     → Funciones de utilidad (date, path, posts, string)
│
├── astro.config.mjs               → Configuración de Astro, Tailwind Vite, i18n y plugins Remark
├── biome.jsonc                    → Configuración del linter y formateador Biome 2
├── bun.lock                       → Lockfile oficial de dependencias de Bun
├── package.json                   → Definición de scripts y dependencias del proyecto
├── vitest.config.ts               → Configuración de pruebas unitarias con Vitest
└── wrangler.jsonc                 → Configuración de Cloudflare Pages, D1 Database y KV Bindings
```

---

## 5. Arquitectura y Flujo de Datos

```
[ Usuario en Navegador ]
        │
        ├── Carga de Páginas / Artículos: Servido desde CDN Edge (HTML estático + CSS + JS)
        ├── Búsqueda de Texto: Pagefind (WASM + Índices estáticos en /dist/pagefind/)
        │
        └── Envío de Comentarios:
                 │
                 ▼  POST /api/comments/:slug
        [ Cloudflare Pages Functions (Hono 4) ]
                 │
                 ├── 1. Rate Limiting: Verifica IP en KV (máx 5 peticiones / 60 seg)
                 ├── 2. Validación: CommentSchema con Zod (author, content, token)
                 ├── 3. Anti-Bot: Valida token contra Cloudflare Turnstile API
                 ├── 4. Sanitización: Limpieza de HTML para prevenir XSS
                 ├── 5. Persistencia: INSERT en Cloudflare D1 (SQLite)
                 └── 6. Invalidación: Purga la clave comments:slug en KV Cache
```

---

## 6. Variables de Entorno y Bindings

### Frontend (Build & Cliente)
Configuradas en `.env` (local) o variables de entorno de Cloudflare Pages:

| Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Pública | Clave pública del widget de Cloudflare Turnstile en el formulario de comentarios. |

### Backend Edge (Cloudflare Pages Functions)
Configuradas en `.dev.vars` (desarrollo local) o en secrets de Cloudflare Pages (producción):

| Binding / Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `DB` | D1 Binding | Conexión a la base de datos D1 `blog-comments` (ID: `744a94e3-069c-4f0e-8e2a-40358b2dc74b`). |
| `KV` | KV Binding | Namespace de Workers KV para caché de comentarios y control de tasa (ID: `9b86fe89e24443fb892f1e2b91383d12`). |
| `TURNSTILE_SECRET_KEY` | Secreto | Clave secreta para la verificación server-side de tokens contra la API de Cloudflare. |

---

## 7. Comandos de Desarrollo y Tooling

Todos los comandos deben ejecutarse con **Bun**:

```bash
# Desarrollo Frontend (Servidor Astro dev en puerto 4321)
bun run dev

# Desarrollo Fullstack (Build estático + emulación de Pages Functions con D1 y KV locales)
bun run dev:full

# Compilación de producción (Astro build + indexación de búsqueda con Pagefind)
bun run build

# Previsualización del build estático generado en dist/
bun run preview

# Diagnóstico y corrección automática con Biome
bun run check
bun run lint
bun run format

# Ejecución de pruebas unitarias con Vitest
bun run test

# Sincronización de Base de Datos D1 (export remoto -> import local)
bun run sync:db
```

---

## 8. Convenciones Obligatorias para Agentes

### 8.1 Gestor de Paquetes Exclusivo
* **Utiliza siempre `bun`.** Queda terminantemente prohibido el uso de `npm`, `yarn` o `pnpm`.

### 8.2 Regla de Oro en Ejecución de Pruebas
* **NO ejecutar comandos de test de forma reactiva tras cada pequeño cambio.** Realizar todos los cambios de código primero y correr las suites de pruebas únicamente al final cuando todo el conjunto esté listo y verificado.

### 8.3 Centralización de Assets en R2
* Todos los assets estáticos del blog (favicons pesados, logos de proyectos, imágenes Open Graph) deben residir en el bucket centralizado `assets-mgdc` bajo la ruta `/fluxdevblog/` y servirse mediante `https://assets.mgdc.site/fluxdevblog/<archivo>`.
* No agregar imágenes estáticas pesadas al directorio `public/` local si superan unos pocos kilobytes.

### 8.4 Estilo de Código y Comentarios
* **Idioma:** Todo el código, comentarios y documentación deben redactarse en **español**.
* **Comentarios concisos:** Comentarios de una sola línea, directos y explicativos del *por qué*, sin bloques redundantes ni explicaciones obvias.
* **Tipado estricto:** Prohibido el uso de `any` en TypeScript; tipar rigurosamente props, respuestas de API y esquemas.

### 8.5 Flujo de Git y Despliegues
* **PROHIBIDO realizar commits o push sin la aprobación explícita del usuario.**
* **Flujo de ramas:** Todo desarrollo se realiza en la rama `develop` y se mergea hacia `main` mediante fast-forward una vez validado.
* **Mensajes de commit:** Seguir la especificación *Conventional Commits* en minúsculas y español (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`). **Estrictamente una sola línea de título sin cuerpo, saltos de línea ni viñetas adicionales**.
* **Sincronización de CodeGraph:** Tras crear, renombrar o eliminar archivos, ejecutar `codegraph sync /home/ivan/software-dev/fluxdev-blog` para mantener el grafo de conocimiento actualizado.
