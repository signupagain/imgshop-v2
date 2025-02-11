import { MongoClient } from 'mongodb'
import type { z } from 'zod'

export default eventHandler({
	async handler(event) {
		const auth = getHeader(event, 'Authorization')

		if (!auth) throwUnauthorization()

		const accessJWT = auth.split(' ')[1]

		if (!accessJWT || accessJWT.length === 0) throwUnauthorization()

		const { decodeJWT } = await useJWT(event)

		const result = await decodeJWT(accessJWT).catch((res: Error) => res.name)

		if (typeof result === 'string') throwUnauthorization()

		const config = useRuntimeConfig(event)

		const client = new MongoClient(config.mongodbUrl)

		const db = client.db('imgshop')

		const users = db.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const doc = await users.findOne<FullUserData>(
			{
				username: result.payload.username,
			},
			{ projection: { _id: 0 } }
		)

		if (doc === null) {
			await client.close()
			throwServerError()
		}

		const response: SerializableUserData = {
			username: doc.username,
			name: doc.name,
			ownList: doc.ownList,
		}

		if (doc.ownList.length !== 0) {
			const images =
				db.collection<z.infer<typeof ImagesCollectionSchema>>('images')

			const idList = doc.ownList.map(val => +val.substring(2))

			const docs = await images
				.find({ id: { $in: idList } }, { projection: { _id: 0, userList: 0 } })
				.toArray()

			const imgMap = Object.fromEntries(docs.map(val => [`id${val.id}`, val]))

			Object.assign(response, { imgMap })
		}

		await client.close()

		setResponseStatus(event, 200, '成功加載')

		return response
	},
})
