export const enum JwkType {
	private,
	public,
}

export const importJWK = (jwk: string, type: JwkType) =>
	crypto.subtle.importKey(
		'jwk',
		JSON.parse(jwk),
		{ name: 'ECDSA', namedCurve: 'P-256' } as EcKeyImportParams,
		true,
		type === JwkType.private ? ['sign'] : ['verify']
	)
