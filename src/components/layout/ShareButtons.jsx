import { useState } from "react";

// Botones para compartir en redes sociales con copia de enlace
function ShareButtons({ title, url }) {
	const [copied, setCopied] = useState(false);

	const shareLinks = {
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
	};

	const handleCopy = async () => {
		// 1. Copia la URL al portapapeles
		try {
			await navigator.clipboard.writeText(window.location.href);
			// 2. Muestra feedback visual
			setCopied(true);
			// 3. Oculta el mensaje tras 2 segundos
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silencioso si no hay permisos
		}
	};

	return (
		<div className="flex items-center gap-4 mt-8 py-4 border-t border-border-subtle">
			<span className="text-sm font-bold text-text-muted uppercase tracking-wider">
				Compartir:
			</span>
			<div className="flex gap-3">
				{/* Twitter/X */}
				<a
					href={shareLinks.twitter}
					target="_blank"
					rel="noopener noreferrer"
					className="group relative size-11 flex items-center justify-center rounded-full bg-bg-card border border-border-subtle text-text-muted transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:-translate-y-1 hover:shadow-lg dark:hover:bg-white dark:hover:text-black dark:hover:border-white"
					aria-label="Compartir en Twitter"
				>
					<span className="icon-[ri--twitter-x-fill] w-5 h-5" />
					<span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
						Twitter
					</span>
				</a>

				{/* LinkedIn */}
				<a
					href={shareLinks.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					className="group relative size-11 flex items-center justify-center rounded-full bg-bg-card border border-border-subtle text-text-muted transition-all duration-300 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] hover:-translate-y-1 hover:shadow-lg"
					aria-label="Compartir en LinkedIn"
				>
					<span className="icon-[ri--linkedin-fill] w-5 h-5" />
					<span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
						LinkedIn
					</span>
				</a>

				{/* Copiar enlace */}
				<button
					type="button"
					onClick={handleCopy}
					className="group relative size-11 flex items-center justify-center rounded-full bg-bg-card border border-border-subtle text-text-muted transition-all duration-300 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 hover:shadow-lg"
					aria-label="Copiar enlace"
				>
					<span className="icon-[solar--link-outline] w-5 h-5" />
					<span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
						Copiar
					</span>
				</button>
			</div>
			{/* Feedback de copia */}
			<span
				className={`text-xs text-accent font-medium transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
			>
				¡Enlace copiado!
			</span>
		</div>
	);
}

export default ShareButtons;
