import type { StringValue } from 'ms'
import { jwtVerify, SignJWT } from 'jose'
import type { H3Event, EventHandlerRequest } from 'h3'

export default async (event: H3Event<EventHandlerRequest>) => {
	const config = useRuntimeConfig(event)

	const privateKey = await importJWK(
		useBase64Decoder(config.jwtPrivateKey),
		JwkType.private
	)

	const publicKey = await importJWK(
		useBase64Decoder(config.jwtPublicKey),
		JwkType.public
	)

	const Expire = {
		accessExp: config.public.jwtAccessExp as StringValue,
		refreshExp: config.public.jwtRefreshExp as StringValue,
	} as const

	type dataType = { username: string }

	const encode2JWT = (data: dataType, expireType: keyof typeof Expire) =>
		new SignJWT(data)
			.setProtectedHeader({ alg: 'ES256' })
			.setIssuedAt()
			.setIssuer(config.jwtIssuer)
			.setAudience(config.jwtAudience)
			.setExpirationTime(Expire[expireType])
			.sign(privateKey)

	const decodeJWT = (token: string) =>
		jwtVerify<dataType>(token, publicKey, {
			issuer: config.jwtIssuer,
			audience: config.jwtAudience,
		})

	return { Expire, encode2JWT, decodeJWT }
}
