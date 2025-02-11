declare namespace NodeJS {
	interface ProcessEnv {
		readonly NUXT_PUBLIC_APP_NAME: string
		readonly NUXT_PUBLIC_IMG_GROUP_SIZE: string
		readonly NUXT_PUBLIC_ACCOUNT_LENGTH: string
		readonly NUXT_PEXELS_API_BASE_URL: string
		readonly NUXT_PEXELS_API_AUTH: string
		readonly NUXT_MONGODB_URL: string
		readonly NUXT_JWT_ISSUER: string
		readonly NUXT_JWT_AUDIENCE: string
		readonly NUXT_JWT_PUBLIC_KEY: string
		readonly NUXT_JWT_PRIVATE_KEY: string
		readonly NUXT_PUBLIC_JWT_REFRESH_EXP: string
		readonly NUXT_PUBLIC_JWT_ACCESS_EXP: string
	}
}
