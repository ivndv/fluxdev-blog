# Fluxdev Blog 

## Descripción

Plataforma web moderna diseñada para compartir artículos, guías técnicas y reflexiones sobre desarrollo web, arquitectura de software, frontend y backend. El objetivo es ofrecer a los lectores una experiencia rápida, accesible y sin distracciones, con soporte multi-idioma nativo, motor de búsqueda instantánea del lado del cliente mediante WebAssembly y un sistema interactivo de comentarios desplegado en el edge.

## Características

- **Lectura optimizada y sin distracciones**: Artículos con tipografía cuidada, tiempos estimados de lectura y navegación rápida y ligera.
- **Búsqueda instantánea de publicaciones**: Encuentra artículos y temas específicos en tiempo real mientras escribes, sin tiempos de espera.
- **Comentarios y debate interactivo**: Comparte tu opinión y conversa con otros lectores al final de cada publicación con validación segura.
- **Soporte multi-idioma**: Interfaz y publicaciones completamente disponibles en español e inglés.
- **Modo oscuro y claro**: Experiencia visual cómoda que se adapta a tus preferencias con transiciones suaves.
- **Exploración temática por etiquetas**: Clasificación organizada para descubrir con facilidad artículos sobre desarrollo, herramientas y arquitectura.
- **Diseño totalmente responsivo**: Lectura fluida y adaptable en cualquier dispositivo, desde teléfonos móviles hasta pantallas grandes.

## Secciones

1. **Inicio**: Portada con las publicaciones más recientes, artículos destacados y paginación fluida.
2. **Blog / Artículos**: Listado completo de publicaciones con cálculo estimado de tiempo de lectura, fecha y filtros.
3. **Detalle de Artículo**: Lectura inmersiva con formato tipográfico enriquecido, botones para compartir y sección de comentarios en vivo.
4. **Etiquetas**: Explorador temático para descubrir artículos agrupados por tecnologías y conceptos clave.
5. **Acerca de**: Perfil profesional del autor, trayectoria y tecnologías utilizadas en sus proyectos.
6. **Legal**: Términos de uso y políticas de privacidad del sitio.

## Uso

- **Visualizar Contenido**: La plataforma ya está activa y puedes explorarla en vivo aquí: [Fluxdev Blog](https://fluxdev-nebula.mgdc.site/).
- **Explorar Artículos**: Navega entre las publicaciones recientes o filtra por etiquetas para acceder a temas específicos.
- **Buscar Publicaciones**: Abre la ventana de búsqueda desde la barra superior y escribe palabras clave para encontrar artículos al instante.
- **Dejar Comentarios**: Comparte tu opinión al final de cualquier publicación mediante el formulario interactivo protegido con verificación anti-bot.
- **Alternar Idioma y Tema**: Cambia entre español e inglés y alterna entre modo claro y oscuro con un solo clic desde la barra superior.

## Tecnologías Utilizadas

- **Frontend**: Astro 7, React 19, Tailwind CSS 4, @fontsource/outfit
- **Backend & Edge**: Cloudflare Pages Functions (Hono 4)
- **Base de Datos & Almacenamiento**: Cloudflare D1 (SQLite), Workers KV, Cloudflare R2
- **Seguridad**: Cloudflare Turnstile, sanitize-html
- **Búsqueda**: Pagefind
- **Analíticas**: Umami Analytics
- **Estado**: Zustand 5
- **Validación**: Zod 4
- **Testing**: Vitest
- **Herramientas**: Bun, Biome, TypeScript
- **Infra & CI/CD**: Cloudflare Pages, GitHub Actions

## Instalación

1. **Clonar el Repositorio**: Descarga el código de este proyecto en tu máquina usando Git:

```bash
git clone https://github.com/ivndv/fluxdev-blog.git
```

2. **Instalar Dependencias**: Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
bun install
```

3. **Variables de Entorno**: Crea un archivo `.dev.vars` o `.env` en la raíz con las siguientes variables:

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

La plataforma está construida para ofrecer la máxima velocidad con generación estática (SSG) y API distribuida en el edge, desplegada de forma global a través de Cloudflare Pages. Puedes usarla directamente aquí: [fluxdev-nebula.mgdc.site](https://fluxdev-nebula.mgdc.site/)

## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
