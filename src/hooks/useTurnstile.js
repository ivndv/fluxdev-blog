// React
import { useEffect } from "react";

// Hook para renderizar y resetear el widget de Turnstile
export function useTurnstile(siteKey, widgetId = "turnstile-widget") {
	// 1. Renderiza el widget al montar el componente
	useEffect(() => {
		if (window.turnstile) {
			window.turnstile.render?.(`#${widgetId}`, { sitekey: siteKey });
		}
	}, [siteKey, widgetId]);

	// Resetea el widget al llamar resetWidget
	const resetWidget = () => {
		if (window.turnstile) {
			window.turnstile.reset(`#${widgetId}`);
		}
	};

	return { resetWidget };
}
