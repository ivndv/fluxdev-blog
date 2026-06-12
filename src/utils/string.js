// Obtiene las iniciales de un nombre (máximo 2 caracteres)
export function initials(name) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.substring(0, 2)
		.toUpperCase();
}
