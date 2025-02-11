import type { RouterConfig } from 'nuxt/schema'

export default {
	sensitive: true,
	strict: true,
	scrollBehavior: (to, from, savedPosition) => {
		const app = useNuxtApp()

		return new Promise(resolve => {
			if (to.name === from.name && to.name === 'index')
				return resolve({ top: 0, behavior: 'smooth' })

			if (
				to.name.endsWith('-id') ||
				(typeof from.name === 'string' && from.name.endsWith('-id'))
			)
				return resolve()

			app.hooks.hookOnce('page:finish', async () => {
				await nextTick()

				if (savedPosition) resolve(savedPosition)

				setTimeout(() => {
					resolve({ top: 0, behavior: 'instant' })
				}, 610)
			})
		})
	},
} satisfies RouterConfig
