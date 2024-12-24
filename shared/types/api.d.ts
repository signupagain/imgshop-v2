export {}

export interface IError {
	code: number
	message: string
}

export interface ISuccess<T> extends IError {
	data: T
}
