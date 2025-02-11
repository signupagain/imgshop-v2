import type { z } from 'zod'

export const useUserStore = defineStore('USERSTORE', () => {
	const { accessJWT, refreshExp, sessionUserData } = useUserStorage()

	const userData = ref<ClientUserData | null>(null)

	const isSignin = ref(false)

	watch(
		userData,
		data => {
			if (data === null) return (sessionUserData!.value = data)

			isSignin.value = true

			const { username, name, ownList, imgMap } = data

			sessionUserData!.value = {
				username,
				name,
				ownList,
				imgMap: imgMap ? Object.fromEntries(imgMap.entries()) : undefined,
			}
		},
		{ deep: true }
	)

	const refreshTimeoutToken = ref<NodeJS.Timeout>()

	async function createUser(
		username: string,
		password: string
	): Promise<boolean> {
		const app = useNuxtApp()

		const result = await app
			.$api('/api/user', {
				method: 'POST',
				body: { username, password },
			})
			.catch((res: IFetchError) => res.status)

		return typeof result !== 'number'
	}

	async function signin(username: string, password: string): Promise<boolean> {
		const app = useNuxtApp()

		const result = await app
			.$api<UserTokenType>('/api/auth/signin', {
				method: 'POST',
				body: { username, password },
			})
			.catch((res: IFetchError) => res.status)

		if (typeof result === 'number' || !result) return false

		refreshExp!.value = result.refreshExp
		accessJWT!.value = result.accessJWT

		const isSuccess = usePersistNewRefresh(refreshExp!, refreshTimeoutToken)

		if (!isSuccess) throwServerError()

		const isPermissionGranted = await useNewAccess()

		if (!isPermissionGranted) throwServerError()

		const data = await useFetchUserData()

		if (!data) throwServerError()

		userData.value = useFormatUserData(data)

		sessionUserData!.value = data

		isSignin.value = true

		return true
	}

	const isChecked = ref(false)

	async function autoSignin() {
		if (isChecked.value) return

		if (!accessJWT?.value || !refreshExp.value) {
			isChecked.value = true
			return
		}

		if (sessionUserData?.value) {
			isChecked.value = true

			const isSuccess = usePersistNewRefresh(refreshExp, refreshTimeoutToken)

			if (!isSuccess) await signout()

			userData.value = useFormatUserData(sessionUserData.value)

			return
		}

		const isSuccess = usePersistNewRefresh(refreshExp, refreshTimeoutToken)

		if (!isSuccess) {
			isChecked.value = true
			await signout()

			return
		}

		isChecked.value = true

		const data = await useFetchUserData()

		userData.value = useFormatUserData(data)

		sessionUserData!.value = data

		isSignin.value = true
	}

	async function signout() {
		userData.value = null

		accessJWT!.value = null
		refreshExp!.value = null

		clearTimeout(refreshTimeoutToken.value)

		useState<IAlert[]>('alertList').value.push({
			type: 'info',
			title: '已登出',
			id: nanoid(5),
		})

		const app = useNuxtApp()

		await app.$api('/api/auth/signout', { method: 'POST' })
	}

	async function updateUserData(body: z.infer<typeof PatchUserDataSchema>) {
		const app = useNuxtApp()

		const update = async () =>
			await app
				.$api('/api/user', {
					method: 'PATCH',
					headers: {
						Authorization: useAuthorization(),
					},
					body,
				})
				.catch((res: IFetchError) => res.status)

		let result = await update()

		if (result === 401) {
			const isPermissionGranted = await useNewAccess()

			if (!isPermissionGranted) return false

			result = await update()
		}

		return typeof result !== 'number'
	}

	return {
		userData,
		refreshTimeoutToken,
		isChecked,
		isSignin,
		createUser,
		signin,
		autoSignin,
		signout,
		updateUserData,
	}
})
