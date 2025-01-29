import type { RouterConfig } from 'nuxt/schema'

export default {
	sensitive: true,
	strict: true,
	scrollBehavior: async (to, from, savedPosition) => {
		if (to.name.endsWith('-id') || from.name?.endsWith('-id')) return false

		if (savedPosition) return savedPosition

		return { top: 0, behavior: 'smooth' }
	},
} satisfies RouterConfig
