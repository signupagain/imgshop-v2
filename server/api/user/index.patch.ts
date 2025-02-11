import { type Collection, MongoClient } from 'mongodb'
import type { z } from 'zod'

export default eventHandler({
	async handler(event) {
		const auth = getHeader(event, 'Authorization')

		if (!auth || !auth.startsWith('Bearer ')) throwUnauthorization()

		const accessJWT = auth.split(' ')[1]

		if (!accessJWT || accessJWT.length === 0) throwUnauthorization()

		const { decodeJWT } = await useJWT(event)
		const identity = await decodeJWT(accessJWT).catch((res: Error) => res.name)

		if (typeof identity === 'string') throwUnauthorization()

		const body = await readValidatedBody(event, PatchUserDataSchema.safeParse)

		if (!body.success) throwFormatError()

		const config = useRuntimeConfig(event)
		const client = new MongoClient(config.mongodbUrl)
		const db = client.db('imgshop')

		const users = db.collection<z.infer<typeof UsersCollectionSchema>>('users')

		const patchImgList = body.data.patchImgList

		delete body.data.patchImgList

		const userDoc = await users
			.findOneAndUpdate(
				{ username: identity.payload.username },
				{
					$set:
						body.data.name ?
							{
								name: body.data.name,
							}
						:	{},
					$push:
						body.data.ownList ? { ownList: { $each: body.data.ownList } } : {},
					$pull:
						patchImgList?.every(val => typeof val === 'string') ?
							{
								ownList: {
									$in: patchImgList,
								},
							}
						:	{},
				}
			)
			.catch((res: Error) => res.name)

		if (typeof userDoc === 'string' || userDoc === null) {
			await client.close()
			throwServerError()
		}

		if (patchImgList) {
			const images = db.collection<
				z.infer<typeof ImgSchema> & { userList: [string, ...string[]] }
			>('images')

			await updateImages(images, identity.payload.username, patchImgList)
		}

		await client.close()

		if (!body.success) throwFormatError()

		return null
	},
})

async function updateImages(
	collection: Collection<z.infer<typeof ImagesCollectionSchema>>,
	username: string,
	imagesArr: z.infer<typeof PatchImgListSchema>
) {
	if (imagesArr.every(v => typeof v === 'string')) {
		const updateResult = await collection
			.updateMany(
				{ id: { $in: imagesArr.map(val => +val.substring(2)) } },
				{ $pull: { userList: username } }
			)
			.catch((res: Error) => res.name)

		if (typeof updateResult === 'string') throwServerError()

		const deleteResult = await collection
			.deleteMany({ userList: [] })
			.catch((res: Error) => res.name)

		if (typeof deleteResult === 'string') throwServerError()

		return
	}

	await Promise.all(
		imagesArr.map(async imgData => {
			const result = await collection
				.updateOne(
					{ id: imgData.id },
					{ $push: { userList: username }, $setOnInsert: imgData },
					{ upsert: true }
				)
				.catch((res: Error) => res.name)

			if (typeof result === 'string') throwServerError()
		})
	)
}
