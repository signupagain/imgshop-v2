import { MongoClient } from 'mongodb'
import type { z } from 'zod'

export default eventHandler({
	async handler(event) {
		const account = await readValidatedBody(event, AccountSchema.safeParse)

		if (!account.success) throwFormatError()

		const config = useRuntimeConfig(event)

		await createAccount(config.mongodbUrl, account.data)

		setResponseStatus(event, 204, '創建成功')

		return null
	},
})

async function createAccount(
	auth: string,
	{ username, password }: z.infer<typeof AccountSchema>
): Promise<FullUserData> {
	const client = new MongoClient(auth)
	const users = client
		.db('imgshop')
		.collection<z.infer<typeof UsersCollectionSchema>>('users')

	const conflict = await users.findOne({ username })

	if (conflict !== null) throwSameUsernameError()

	password = await useSHA256(password)

	const data: FullUserData = {
		username,
		password,
		name: '',
		refresh: '',
		ownList: [],
	}

	const result = await users.insertOne(data)

	await client.close()

	if (!result.acknowledged) throwServerError()

	return data
}
