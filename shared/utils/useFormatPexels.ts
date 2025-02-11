export const formatMultipleImg = (data: PhotosWithTotalResults): ResultType => {
	const photos = data.photos.map(val => formatSingleImg(val))

	return { ...data, photos }
}

export const formatSingleImg = (data: Photo): ImgType => {
	const excludes = ['avg_color', 'photographer_id', 'liked'] as const
	const entries = Object.entries(data)
	assertPhotoEntries(data, entries)

	return Object.fromEntries(
		entries.filter(([key, _]) => !excludes.some(val => val === key))
	)

	function assertPhotoEntries(
		data: Photo,
		entries: [string, unknown][]
	): asserts entries is toEntries<Photo> {
		entries.forEach(([key, val]) => {
			assertIsKeyof(data, key)
			if (data[key] !== val) throw new Error('Invalid key-value pair')
		})
	}
}
