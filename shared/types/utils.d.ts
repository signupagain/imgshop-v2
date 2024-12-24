import type { RouteNamedMap } from 'vue-router/auto-routes'

export {}

type Contra<T> = T extends unknown ? (x: T) => void : never

export type UnionToIntersection<T> =
	Contra<T> extends (x: infer R) => void ? R : never

export type toEntries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]

export type RouteNameArr = (keyof RouteNamedMap)[]

export interface IFetchError<T = Error> extends Error {
	request?: FetchRequest
	options?: FetchOptions
	response?: FetchResponse<T>
	data?: T
	status: number
	statusText?: string
	statusCode?: number
	statusMessage?: string
}

export interface IAlert {
	id: string
	type: 'success' | 'info' | 'warning' | 'error'
	title: string
	text?: string
}
