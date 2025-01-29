export default async <ReturnT, QueryT extends QueriesType>(
	path: string,
	query: QueryT
) => {
	const { pexelsApiAuth: Authorization, pexelsApiBaseUrl: baseURL } =
		useRuntimeConfig()

	if ('id' in query) path += query.id

	return await $fetch<ReturnT>(path, {
		method: 'GET',
		baseURL,
		headers: {
			Authorization,
		},
		query,
	})
}
