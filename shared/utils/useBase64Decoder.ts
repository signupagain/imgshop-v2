import { base64url } from 'jose'

export default (text: string): string =>
	new TextDecoder().decode(base64url.decode(text))
