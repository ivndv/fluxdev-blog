// Idiomas soportados: código ISO → etiqueta visible en UI
export const languages = {
	es: "Español",
	en: "English",
};

// Idioma por defecto del sitio: se usa como fallback
export const defaultLang = "es";

// Diccionario de textos traducidos por idioma y clave
export const ui = {
	es: {
		"nav.home": "Inicio",
		"nav.blog": "Blog",
		"nav.about": "Acerca de",
		"blog.title": "Artículos",
		"blog.subtitle":
			"Guías, tutoriales y reflexiones sobre desarrollo de software, frontend, backend y productividad.",
		"blog.readMore": "Leer más",
		"blog.readTime": "min lectura",
		"blog.published": "Publicado el",
		"blog.back": "Volver al blog",
		"footer.copyright": "Flux.",
		"footer.rights": "Todos los derechos reservados.",
		"footer.developedBy": "Desarrollado por",
		"footer.description":
			"Un espacio para compartir conocimientos sobre desarrollo, tecnología y herramientas.",
		"footer.nav": "Navegación",
		"footer.legal": "Legal",
		"footer.subscribe": "Suscríbete",
		"footer.subscribePlaceholder": "Tu correo electrónico",
		"footer.subscribeButton": "Suscribirse",
		"footer.terms": "Términos y Condiciones",
		"footer.privacy": "Política de Privacidad",
		"search.placeholder": "Buscar...",
		"search.title": "Buscar en el blog",
		"search.close": "Cerrar",
		"search.clear": "Limpiar",
		"search.loadMore": "Cargar más resultados",
		"search.zero": "Sin resultados para [SEARCH_TERM]",
		"search.one": "[COUNT] resultado para [SEARCH_TERM]",
		"search.many": "[COUNT] resultados para [SEARCH_TERM]",
		"search.searching": "Buscando [SEARCH_TERM]...",
		"search.label": "Buscar en este sitio",
		"search.loading": "Cargando buscador...",
		"search.unavailable": "La búsqueda no está disponible en este momento.",
		"tags.exploring": "Explorando",
		"tags.title": "Artículos sobre",
		"home.hero.badge": "Blog personal",
		"home.hero.title": "Desarrollo de software, tutoriales y",
		"home.hero.subtitle": "un poco de mí.",
		"home.hero.cta": "Ver artículos",
		"home.hero.ctaAlt": "Acerca de mí",
		"home.articles": "artículos",
		"home.welcome":
			"Escribo sobre desarrollo web, herramientas y las cosas que voy aprendiendo en el camino. Artículos técnicos, guías prácticas y notas de lo que construyo.",
		"home.popular": "Temas Populares",
		"home.note": "Nota:",
		"home.note2":
			"Esta página web es nueva, por ende es posible que tenga algunos bugs visuales, artículos que no cargan o mal rendimiento en general. No te preocupes si ves errores, estoy trabajando en ello :)",
		"comments.title": "Comentarios",
		"comments.loading": "Cargando comentarios...",
		"comments.leave": "Deja un comentario",
		"comments.name": "Nombre",
		"comments.namePlaceholder": "Tu nombre",
		"comments.comment": "Comentario",
		"comments.commentPlaceholder": "Escribe tu opinión...",
		"comments.submit": "Publicar comentario",
		"comments.submitting": "Enviando...",
		"comments.success": "¡Comentario publicado!",
		"comments.error": "Hubo un error al enviar el comentario.",
		"comments.empty": "Sé el primero en comentar.",
		"comments.loadError": "Error al cargar comentarios.",
	},
	en: {
		"nav.home": "Home",
		"nav.blog": "Blog",
		"nav.about": "About",
		"blog.title": "Articles",
		"blog.subtitle":
			"Guides, tutorials and reflections on software development, frontend, backend and productivity.",
		"blog.readMore": "Read more",
		"blog.readTime": "min read",
		"blog.published": "Published on",
		"blog.back": "Back to blog",
		"footer.copyright": "Flux.",
		"footer.rights": "All rights reserved.",
		"footer.developedBy": "Developed by",
		"footer.description":
			"A space to share knowledge about development, technology and tooling.",
		"footer.nav": "Navigation",
		"footer.legal": "Legal",
		"footer.subscribe": "Subscribe",
		"footer.subscribePlaceholder": "Your email",
		"footer.subscribeButton": "Subscribe",
		"footer.terms": "Terms and Conditions",
		"footer.privacy": "Privacy Policy",
		"search.placeholder": "Search...",
		"search.title": "Search the blog",
		"search.close": "Close",
		"search.clear": "Clear",
		"search.loadMore": "Load more results",
		"search.zero": "No results for [SEARCH_TERM]",
		"search.one": "[COUNT] result for [SEARCH_TERM]",
		"search.many": "[COUNT] results for [SEARCH_TERM]",
		"search.searching": "Searching for [SEARCH_TERM]...",
		"search.label": "Search this site",
		"search.loading": "Loading search...",
		"search.unavailable": "Search is unavailable right now.",
		"tags.exploring": "Exploring",
		"tags.title": "Articles about",
		"home.hero.badge": "Personal blog",
		"home.hero.title": "Software development, tutorials and",
		"home.hero.subtitle": "a bit of me.",
		"home.hero.cta": "Read articles",
		"home.hero.ctaAlt": "About me",
		"home.articles": "articles",
		"home.welcome":
			"I write about web development, tooling and the things I learn along the way. Technical articles, practical guides and notes from what I build.",
		"home.popular": "Popular Topics",
		"home.note": "Note:",
		"home.note2":
			"This website is new, therefore it may have some visual bugs, articles that do not load or poor performance in general. Do not worry if you see errors, I am working on it :)",
		"comments.title": "Comments",
		"comments.loading": "Loading comments...",
		"comments.leave": "Leave a comment",
		"comments.name": "Name",
		"comments.namePlaceholder": "Your name",
		"comments.comment": "Comment",
		"comments.commentPlaceholder": "Write your opinion...",
		"comments.submit": "Post comment",
		"comments.submitting": "Submitting...",
		"comments.success": "Comment posted!",
		"comments.error": "There was an error posting the comment.",
		"comments.empty": "Be the first to comment.",
		"comments.loadError": "Error loading comments.",
	},
} as const;

// Hook que retorna funcion t(key) con fallback al idioma default
export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		// 1. Intentar obtener valor en el idioma destino
		// 2. Si no existe, fallback al idioma por defecto
		// 3. Si tampoco existe, retorna undefined
		return ui[lang][key] || ui[defaultLang][key];
	};
}
