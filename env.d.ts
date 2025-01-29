declare namespace NodeJS {
	interface ProcessEnv {
		readonly NUXT_PUBLIC_APP_NAME: string
		readonly NUXT_PUBLIC_IMG_GROUP_SIZE: string
		readonly NUXT_PEXELS_API_BASE_URL: string
		readonly NUXT_PEXELS_API_AUTH: string
	}
}
