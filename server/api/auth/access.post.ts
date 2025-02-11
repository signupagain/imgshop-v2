import { MongoClient } from 'mongodb'
import type { z } from 'zod'
import { TokenKey } from '~~/shared/constants/tokenKey'

export default eventHandler({
	async handler(event) {
		const refresh = getCookie(event, TokenKey.refresh)

		if (!refresh) throwUnauthorization()

		const config = useRuntimeConfig(event)

		const client = new MongoClient(config.mongodbUrl)

		const users = client
			.db('imgshop')
			.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const doc = await users
			.findOne<FullUserData>({ refresh })
			.catch((res: Error) => res.name)

		await client.close()

		if (typeof doc === 'string') throwServerError()

		if (doc === null) throwUnauthorization()

		const { encode2JWT } = await useJWT(event)

		const accessJWT = await encode2JWT({ username: doc.username }, 'accessExp')

		setResponseStatus(event, 200, '刷新成功')

		return { accessJWT }
	},
})
