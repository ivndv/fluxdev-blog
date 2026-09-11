# FluxDev Blog

## Descripción

Plataforma web moderna diseñada para compartir artículos, guías técnicas y reflexiones sobre desarrollo web, frontend, backend y productividad. Ofrece una experiencia de lectura rápida, accesible y sin distracciones, con soporte multi-idioma, búsqueda instantánea en el cliente y un sistema interactivo de comentarios respaldado en la nube.

## Características

- **Lectura optimizada y rendimiento estático**: Publicaciones generadas estáticamente para tiempos de carga mínimos y una experiencia de lectura fluida.
- **Búsqueda instantánea integrada**: Motor de búsqueda en texto completo del lado del cliente mediante WebAssembly, rápido y sin dependencias externas.
- **Comentarios interactivos en el edge**: Participa en la conversación al final de cada artículo con almacenamiento en SQLite y validación anti-spam.
- **Soporte multi-idioma**: Interfaz y artículos completamente disponibles en español e inglés con rutas localizadas.
- **Modo oscuro y claro**: Interfaz adaptable a tus preferencias visuales con transiciones suaves y sin saltos de estilo.
- **Exploración por etiquetas**: Organización temática de contenido para localizar fácilmente temas de programación, arquitectura y herramientas.

## Secciones

1. **Inicio**: Portada con los artículos más recientes, publicaciones destacadas y navegación paginada.
2. **Blog / Artículos**: Listado completo de publicaciones con tiempo estimado de lectura y fecha de publicación.
3. **Detalle de Artículo**: Lectura inmersiva con formato tipográfico enriquecido, botones para compartir y sección de comentarios.
4. **Etiquetas**: Explorador temático para descubrir artículos agrupados por tecnologías y conceptos.
5. **Acerca de**: Información sobre el autor, trayectoria y tecnologías utilizadas en sus proyectos.
6. **Legal**: Términos de uso y políticas de privacidad del sitio.

## Uso

- **Acceder a la Aplicación**: Entra directamente desde cualquier navegador aquí: [FluxDev Blog](https://fluxdev-nebula.mgdc.site/).
- **Explorar Contenido**: Navega entre las publicaciones recientes o filtra artículos por etiquetas temáticas.
- **Buscar Publicaciones**: Abre la ventana de búsqueda desde la barra superior y escribe palabras clave para encontrar artículos al instante.
- **Dejar Comentarios**: Comparte tu opinión al final de cualquier publicación mediante el formulario interactivo.
- **Alternar Idioma y Tema**: Cambia entre español e inglés y alterna entre modo claro y oscuro con un solo clic desde la barra superior.

## Tecnologías Utilizadas

- **Frontend**: Astro 7, React 19, Tailwind CSS 4, @fontsource/outfit
- **Backend**: Cloudflare Pages Functions (Hono 4), Cloudflare D1 (SQLite), Workers KV
- **Autenticación & Anti-Bot**: Cloudflare Turnstile, sanitize-html
- **Búsqueda**: Pagefind
- **Estado**: Zustand 5
- **Validación**: Zod 4
- **Testing**: Vitest
- **Herramientas**: Bun, Biome, TypeScript
- **Infra & CDN**: Cloudflare Pages, Cloudflare R2

## Instalación

1. **Clonar el Repositorio**: Descarga el código de este proyecto en tu máquina usando Git.

```bash
git clone https://github.com/ivndv/fluxdev-blog.git
```

2. **Instalar Dependencias**: Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
bun install
```

3. **Variables de Entorno**: Crea un archivo `.env` o `.dev.vars` en la raíz con las siguientes variables:

```env
PUBLIC_TURNSTILE_SITE_KEY=tu_turnstile_site_key
TURNSTILE_SECRET_KEY=tu_turnstile_secret_key
```

4. **Iniciar el Proyecto**:

```bash
# Solo frontend (Astro):
bun run dev

# Full stack con API (Cloudflare Pages Functions + D1 y KV):
bun run dev:full
```

## Despliegue

La aplicación está construida para ser sumamente ligera y se encuentra desplegada de forma global a través de Cloudflare Pages. Puedes usarla directamente aquí: [fluxdev-nebula.mgdc.site](https://fluxdev-nebula.mgdc.site/)

## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
