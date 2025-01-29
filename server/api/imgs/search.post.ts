import { PexelsMode } from '~~/shared/params/img'

export default eventHandler({
	async handler(event): Promise<ResultType> {
		try {
			const query = getQuery<ISearchQuery>(event)
			const source = await usePexelsAPIServer<
				PhotosWithTotalResults,
				ISearchQuery
			>(PexelsMode.Search, query)

			setResponseStatus(event, 200, '加載成功')

			if (source.total_results === 0)
				setResponseStatus(event, 204, '無相關圖片')

			return formatMultipleImg(source)
		} catch {
			throwServerError()
		}
	},
})
