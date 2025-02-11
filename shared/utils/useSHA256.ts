export default async (word: string) => {
	const view = new TextEncoder().encode(word)

	const hashBuffer = await crypto.subtle.digest('SHA-256', view)

	const hashArray = Array.from(new Uint8Array(hashBuffer))

	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

	return hashHex
}
