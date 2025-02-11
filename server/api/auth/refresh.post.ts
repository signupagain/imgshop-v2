import { MongoClient } from 'mongodb'
import { TokenKey } from '~~/shared/constants/tokenKey'
import ms, { type StringValue } from 'ms'
import type { z } from 'zod'

export default eventHandler({
	async handler(event) {
		const refresh = getCookie(event, TokenKey.refresh)

		const config = useRuntimeConfig(event)
		const client = new MongoClient(config.mongodbUrl)
		const users = client
			.db('imgshop')
			.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const doc = await users
			.findOneAndUpdate(
				{ refresh },
				{ $set: { refresh: nanoid() } },
				{ returnDocument: 'after' }
			)
			.catch((res: Error) => res.name)

		await client.close()

		if (typeof doc === 'string') throwServerError()

		if (doc === null) throwUnauthorization()

		const periodTimeStamp = ms(config.public.jwtRefreshExp as StringValue)
		const sumTimeStamp = new Date().getTime() + periodTimeStamp
		const expires = new Date(sumTimeStamp)

		setCookie(event, TokenKey.refresh, doc.refresh!, {
			sameSite: 'strict',
			secure: true,
			httpOnly: true,
			expires,
		})

		setResponseStatus(event, 200, '刷新成功')

		return { refreshExp: expires.getTime() }
	},
})
