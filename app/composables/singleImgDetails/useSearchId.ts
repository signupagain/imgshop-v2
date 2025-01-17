import { PexelsMode } from '~~/shared/constants/img'

export default (id: number) =>
	useSearchRequest({
		mode: PexelsMode.Specific,
		id,
	}).catch((res: IFetchError) => res.status)
