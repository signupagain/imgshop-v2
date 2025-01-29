import type { RouterConfig } from 'nuxt/schema'

export default {
	sensitive: true,
	strict: true,
	scrollBehavior: (to, from, savedPosition) => {
		return new Promise(resolve => {
			if (savedPosition) resolve(savedPosition)

			if (
				to.name.endsWith('-id') ||
				(typeof from.name === 'string' && from.name.endsWith('-id'))
			)
				return resolve()

			if (to.name === from.name && to.name !== 'search')
				return resolve({ top: 0, behavior: 'smooth' })

			resolve({ top: 0, behavior: 'instant' })
		})
	},
} satisfies RouterConfig
