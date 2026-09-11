// TurnstileValidator - Verificación de token anti-spam con Cloudflare Turnstile
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const FETCH_TIMEOUT_MS = 5000;

export class TurnstileValidator {
	/**
	 * Valida el token emitido por el widget de Turnstile contra los servidores de Cloudflare
	 */
	async verify(
		secretKey: string,
		token: string,
		ip?: string,
	): Promise<boolean> {
		if (!secretKey || !token) {
			return false;
		}

		const formData = new FormData();
		formData.append("secret", secretKey);
		formData.append("response", token);
		if (ip && ip !== "unknown") formData.append("remoteip", ip);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

		try {
			// 1. Envía la solicitud de verificación a Cloudflare
			const res = await fetch(VERIFY_URL, {
				method: "POST",
				body: formData,
				signal: controller.signal,
			});

			// 2. Parsea la respuesta
			const data = (await res.json()) as { success: boolean };
			return Boolean(data.success);
		} catch {
			// 3. En caso de error de red o timeout, retorna false de forma segura
			return false;
		} finally {
			clearTimeout(timeoutId);
		}
	}
}

export const turnstileValidator = new TurnstileValidator();
