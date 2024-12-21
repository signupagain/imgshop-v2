export function assertIsDefined<T>(
	key: string,
	value: T | undefined | null
): asserts value is T {
	if (value === undefined || value === null)
		throw new Error(`${key} is not defined.`)
}

export function assertIsKeyof<T extends object>(
	obj: T,
	value: unknown
): asserts value is keyof T {
	if (typeof value === 'string' && !(value in obj))
		throw new Error(
			`Invalid value: '${value}' is not a key of the provided object. Object keys are: ${Object.keys(obj).join(', ')}`
		)
}
