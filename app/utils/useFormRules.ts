import type { NuxtError } from '#app'

export function isValidString(value: string): true | string {
	return !/[^a-zA-Z\d]/.test(value) || '只接受英文字母和數字'
}

export function isRequired(value: string): true | string {
	return !!value || '不得為空'
}

export function isDifferent(
	username: Ref<string> | string
): (password: Ref<string> | string) => true | string {
	return (password: Ref<string> | string) =>
		toValue(username) !== toValue(password) || '帳號、密碼不得相同'
}

export function useIsSame(password: Ref<string> | string) {
	return function (value: string) {
		return value === toValue(password) || '與密碼不符'
	}
}

isUniqueUsername.cachedAccount = ''
isUniqueUsername.cachedResult = true as true | string

export async function isUniqueUsername(
	account: string
): Promise<true | string> {
	if (account === isUniqueUsername.cachedAccount)
		return isUniqueUsername.cachedResult

	isUniqueUsername.cachedAccount = account

	const { $api } = useNuxtApp()

	const query: UserCheckType = { account }
	const message = await $api('/api/user', { method: 'GET', query }).catch(
		(res: IFetchError<NuxtError>) => res.data?.message
	)

	const result = typeof message !== 'string' || message

	isUniqueUsername.cachedResult = result

	return result
}
