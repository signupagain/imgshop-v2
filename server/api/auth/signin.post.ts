import { MongoClient } from 'mongodb'
import ms from 'ms'
import type { z } from 'zod'
import { TokenKey } from '~~/shared/constants/tokenKey'

export default eventHandler({
	async handler(event) {
		const body = await readValidatedBody(event, AccountSchema.safeParse)

		if (!body.success) throwFormatError()

		const { username, password } = body.data

		const shaPassword = await useSHA256(password)

		const config = useRuntimeConfig()
		const client = new MongoClient(config.mongodbUrl)
		const users = client
			.db('imgshop')
			.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const doc = await users.findOne<FullUserData>({ username })

		if (doc === null || doc.password !== shaPassword) {
			await client.close()
			throwFormatError()
		}

		const refresh = nanoid()

		const result = await users.updateOne({ username }, { $set: { refresh } })

		await client.close()

		if (!result.acknowledged) throwServerError()

		const { encode2JWT, Expire } = await useJWT(event)
		const accessJWT = await encode2JWT({ username }, 'accessExp')

		const periodTimeStamp = ms(Expire.refreshExp)
		const sumTimeStamp = new Date().getTime() + periodTimeStamp
		const expires = new Date(sumTimeStamp)

		setCookie(event, TokenKey.refresh, refresh, {
			sameSite: 'strict',
			secure: true,
			httpOnly: true,
			expires,
		})

		setResponseStatus(event, 200, '登入成功')

		return {
			accessJWT,
			refreshExp: expires.getTime(),
		}
	},
})
