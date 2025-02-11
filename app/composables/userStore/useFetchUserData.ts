export default async function () {
	const { $api } = useNuxtApp()

	const getData = async () =>
		await $api<SerializableUserData>('/api/user/me', {
			method: 'GET',
			headers: { Authorization: useAuthorization() },
		}).catch((err: IFetchError) => err.status)

	let result = await getData()

	if (result === 401) {
		const isPermissionGranted = await useNewAccess()

		if (!isPermissionGranted) throwServerError()

		result = await getData()
	}

	if (typeof result === 'number') throwServerError()

	return result
}
