import { useCreateUser } from '~/composables/useRequests'

export const useUserStore = defineStore('USERSTORE', () => {
	const createUser = async (username: string, password: string) => {
		await useCreateUser({ username, password })
		return !!Math.floor(Math.random() * 2)
	}
	const signin = async (username: string, password: string) => {
		await useCreateUser({ username, password })
		return !!Math.floor(Math.random() * 2)
	}

	const isSignin = ref(!!Math.floor(Math.random() * 2))
	const curThemeOwnList = ref<number[]>([])

	return { createUser, signin, isSignin, curThemeOwnList }
})
