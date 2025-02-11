import { MongoClient } from 'mongodb'
import type { z } from 'zod'

export default eventHandler({
	async handler(event) {
		const query = getQuery<UserCheckType>(event)
		const username = AccountStringSchema.safeParse(query.account)

		if (!username.success) throwFormatError()

		const config = useRuntimeConfig(event)
		const client = new MongoClient(config.mongodbUrl)
		const users = client
			.db('imgshop')
			.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const conflict = await users.findOne({ username: username.data })

		await client.close()

		if (conflict !== null) throwSameUsernameError()

		return null
	},
})
