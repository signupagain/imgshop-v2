export default defineNuxtRouteMiddleware(async to => {
	const imgStore = useImageStore()
	const { curatedLibrary, imgLibrary } = storeToRefs(imgStore)

	if (to.name === 'index') {
		if (curatedLibrary.value.photos.size === 0) {
			const isSuccess = await imgStore.appendCuratedLibrary()

			if (!isSuccess) createError({ message: '伺服器異常', fatal: true })
		}

		return
	}

	if (to.name === 'search') {
		const theme = to.query?.theme

		if (!theme || typeof theme !== 'string' || theme === '')
			return navigateTo('/:slug(.*)*')

		if (imgLibrary.value.has(theme)) return

		const isSuccess = await imgStore.getImages(theme)

		if (!isSuccess) return navigateTo('/:slug(.*)*')
	}
})
