import { z } from 'zod'

export const AccountStringSchema = z
	.string()
	.min(1)
	.max(+process.env.NUXT_PUBLIC_ACCOUNT_LENGTH)
	.refine(val => !/[^a-zA-Z\d]/.test(val))

export const AccountSchema = z
	.object({
		username: AccountStringSchema,
		password: AccountStringSchema,
	})
	.refine(({ username, password }) => username !== password)

const urlSchema = z.string().url().startsWith('https://www.pexels.com')

const imgUrlSchema = z.string().url().startsWith('https://images.pexels.com')

export const ImgSchema = z.object({
	id: z.number(),
	width: z.number(),
	height: z.number(),
	url: urlSchema,
	alt: z.string().nullable(),
	photographer: z.string(),
	photographer_url: urlSchema,
	src: z.object({
		original: imgUrlSchema,
		large2x: imgUrlSchema,
		large: imgUrlSchema,
		medium: imgUrlSchema,
		small: imgUrlSchema,
		portrait: imgUrlSchema,
		landscape: imgUrlSchema,
		tiny: imgUrlSchema,
	}),
})

export const IdSchema = z.string().startsWith('id')

export const ClientUserDataSchema = z.object({
	username: AccountStringSchema,
	name: AccountStringSchema.optional(),
	ownList: IdSchema.array().optional(),
	imgMap: z.map(IdSchema, ImgSchema).optional(),
})

export const PatchImgListSchema = z.union([
	ImgSchema.array().nonempty(),
	IdSchema.array().nonempty(),
])

export const PatchUserDataSchema = z
	.object({
		name: z.string().optional(),
		ownList: IdSchema.array().optional(),
		patchImgList: PatchImgListSchema.optional(),
	})
	.refine(val => Object.keys(val).length > 0)

/*  Collection Type */

export const UsersCollectionSchema = z.object({
	username: AccountStringSchema,
	password: z.string(),
	name: AccountStringSchema,
	ownList: IdSchema.array(),
	refresh: z.string().optional(),
})

export const ImagesCollectionSchema = z
	.object({ userList: AccountStringSchema.array().nonempty() })
	.and(ImgSchema)
