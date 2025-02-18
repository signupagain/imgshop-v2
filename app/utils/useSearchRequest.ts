import { PexelsMode } from '#shared/constants/img'

type ReturnType<J> = J extends PexelsMode.Specific ? ImgType : ResultType

export async function useSearchRequest<T extends PexelsMode>({
	mode,
	id,
	per_page = 80,
	page,
	query,
	size = 'small',
	color,
	orientation,
	locale,
}: { mode: T } & Partial<MergeQueriesType>) {
	const { $api } = useNuxtApp()

	if (mode === PexelsMode.Curated)
		return $api<ReturnType<T>>('/api/imgs/curated', {
			method: 'POST',
			query: { page, per_page },
		})

	if (mode === PexelsMode.Search) {
		assertIsDefined('query', query)

		return $api<ReturnType<T>>('/api/imgs/search', {
			method: 'POST',
			query: {
				page,
				per_page,
				query,
				size,
				color,
				orientation,
				locale,
			},
		})
	}

	assertIsDefined('id', id)

	return $api<ReturnType<T>>('/api/imgs/photos/:id', {
		method: 'POST',
		query: { id },
	})
}
