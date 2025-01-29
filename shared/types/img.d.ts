export {}

export interface ISearchQuery extends ICuratedQuery {
	query: string
	orientation?: 'landscape' | 'portrait' | 'square'
	size?: 'large' | 'medium' | 'small'
	color?: string
	locale?:
		| 'en-US'
		| 'pt-BR'
		| 'es-ES'
		| 'ca-ES'
		| 'de-DE'
		| 'it-IT'
		| 'fr-FR'
		| 'sv-SE'
		| 'id-ID'
		| 'pl-PL'
		| 'ja-JP'
		| 'zh-TW'
		| 'zh-CN'
		| 'ko-KR'
		| 'th-TH'
		| 'nl-NL'
		| 'hu-HU'
		| 'vi-VN'
		| 'cs-CZ'
		| 'da-DK'
		| 'fi-FI'
		| 'uk-UA'
		| 'el-GR'
		| 'ro-RO'
		| 'nb-NO'
		| 'sk-SK'
		| 'tr-TR'
		| 'ru-RU'
}

export interface ICuratedQuery {
	page?: number
	per_page?: number
}

export type SpecificQueryType = { id: number }

export type QueriesType = ISearchQuery | ICuratedQuery | SpecificQueryType

export type MergeQueriesType = UnionToIntersection<QueriesType>

interface PaginationObject {
	page: number
	per_page: number
	next_page?: string
}

export interface Photo {
	id: number
	width: number
	height: number
	url: string // official img source
	alt: string | null
	avg_color: string | null
	photographer: string // photographer's name
	photographer_url: string
	photographer_id: string
	liked: boolean
	src: {
		original: string
		large2x: string
		large: string
		medium: string
		small: string
		portrait: string
		landscape: string
		tiny: string
	}
}

export type Photos = PaginationObject & {
	photos: Photo[]
}

export type PhotosWithTotalResults = Photos & {
	total_results: number
}

export type ImgType = Omit<Photo, 'avg_color' | 'photographer_id' | 'liked'>

export type ResultType = {
	photos: ImgType[]
} & Omit<PhotosWithTotalResults, 'photos'>

export type ImgsLibType = Map<string, ResultType>

export type imgDataType = ImgType & { isOwn: boolean }

export type ImgIdType = `id${string}`
