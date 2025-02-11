import { StorageSerializers, useStorage } from '@vueuse/core'
import { TokenKey } from '~~/shared/constants/tokenKey'

export default () => {
	if (!import.meta.client) return {}

	const refreshExp = useStorage<number>(
		TokenKey.refreshExp,
		null,
		localStorage,
		{
			serializer: StorageSerializers.number,
		}
	)

	const accessJWT = useStorage<string>(TokenKey.accessJWT, null, localStorage, {
		serializer: StorageSerializers.string,
	})

	const sessionUserData = useStorage<SerializableUserData>(
		'data',
		null,
		sessionStorage,
		{ serializer: StorageSerializers.object }
	)

	return { refreshExp, accessJWT, sessionUserData }
}
