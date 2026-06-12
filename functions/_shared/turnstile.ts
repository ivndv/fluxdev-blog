// Turnstile - Verificación de token con Cloudflare
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const FETCH_TIMEOUT_MS = 5000;

// Verifica que el token de Turnstile sea válido
export async function verifyTurnstile(
	secretKey: string,
	token: string,
	ip?: string,
): Promise<boolean> {
	const formData = new FormData();
	formData.append("secret", secretKey);
	formData.append("response", token);
	if (ip) formData.append("remoteip", ip);

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
		const data = await res.json() as { success: boolean };
		return data.success;
	} catch {
		// 3. En caso de error de red, retorna false
		return false;
	} finally {
		clearTimeout(timeoutId);
	}
}
