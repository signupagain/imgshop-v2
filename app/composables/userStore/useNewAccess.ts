export default async function () {
	const { $api } = useNuxtApp()

	const result = await $api<Pick<UserTokenType, 'accessJWT'>>(
		'/api/auth/access',
		{
			method: 'POST',
			credentials: 'same-origin',
		}
	).catch((res: IFetchError) => res.status)

	if (typeof result === 'number') return false

	const { accessJWT } = useUserStorage()

	accessJWT!.value = result.accessJWT

	return true
}
