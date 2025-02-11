import { PexelsMode } from '~~/shared/constants/img'

export default eventHandler({
	async handler(event): Promise<ImgType> {
		try {
			const query = getQuery<SpecificQueryType>(event)
			const source = await usePexelsAPIServer<Photo, SpecificQueryType>(
				PexelsMode.Specific,
				query
			)

			setResponseStatus(event, 200, '搜尋成功')

			return formatSingleImg(source)
		} catch {
			throwNotFound()
		}
	},
})
