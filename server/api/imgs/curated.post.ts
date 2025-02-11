import { PexelsMode } from '~~/shared/constants/img'

export default eventHandler({
	async handler(event): Promise<ResultType> {
		try {
			const query = getQuery<ICuratedQuery>(event)
			const source = await usePexelsAPIServer<
				PhotosWithTotalResults,
				ICuratedQuery
			>(PexelsMode.Curated, query)

			setResponseStatus(event, 200, '加載成功')

			return formatMultipleImg(source)
		} catch {
			throwServerError()
		}
	},
})
