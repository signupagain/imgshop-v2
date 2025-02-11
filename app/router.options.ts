import type { RouterConfig } from 'nuxt/schema'

export default {
	sensitive: true,
	strict: true,
	scrollBehavior(to, from) {
		if (to.name.endsWith('-id') || from.name?.endsWith('-id')) return false

		if (to.name === from.name) return { top: 0, behavior: 'smooth' }

		return { top: 0, behavior: 'smooth' }
	},
} satisfies RouterConfig
