export default useDebounceFn(async (theme: string): Promise<boolean> => {
	const imgStore = useImageStore()

	if (imgStore.imgLibrary.has(theme)) return true

	return await imgStore.getImages(theme)
}, 1000)
