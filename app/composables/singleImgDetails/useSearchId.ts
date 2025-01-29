import { PexelsMode } from '~~/shared/params/img'

export default (id: number) =>
	useSearchRequest({
		mode: PexelsMode.Specific,
		id,
	}).catch((res: IFetchError) => res.status)
