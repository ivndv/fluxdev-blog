// Tipos de props SEO para validación
interface SeoProps {
	title: string;
	description: string;
	type?: "website" | "article";
	publishDate?: string;
}

// Valida las props SEO en modo desarrollo
export function validateSeoProps(props: SeoProps): void {
	// 1. Solo ejecuta en desarrollo
	if (!import.meta.env.DEV) return;

	// 2. Verifica que el título no exceda 60 caracteres
	if (props.title.length > 60) {
		console.warn(`[SeoMeta] Título muy largo (${props.title.length} chars).`);
	}
	// 3. Verifica que la descripción no exceda 160 caracteres
	if (props.description.length > 160) {
		console.warn(`[SeoMeta] Descripción muy larga (${props.description.length} chars).`);
	}
	// 4. Verifica que publishDate sea una fecha ISO válida
	if (props.type === "article" && props.publishDate) {
		const date = new Date(props.publishDate);
		if (Number.isNaN(date.getTime())) {
			console.warn(`[SeoMeta] publishDate inválido: "${props.publishDate}". Usar ISO 8601.`);
		}
	}
}
