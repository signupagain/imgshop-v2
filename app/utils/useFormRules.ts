import type { FetchError } from 'ofetch'

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

export const isUniqueUsername = async (
	account: string
): Promise<true | string> => {
	const app = useNuxtApp()
	const query: UserCheckType = { account }
	const message = await app
		.$api('/api/user', { method: 'GET', query })
		.catch((res: FetchError) => res.data.message as string)

	return typeof message !== 'string' || message
}

export function useIsValidAccount() {
	const isSuccess = ref(true)
	const isValid = () => isSuccess.value || '帳號或密碼有誤'

	return {
		isSuccess,
		isValid,
	}
}
