import ms, { type StringValue } from 'ms'

export default function (
	refreshExp: Ref<number>,
	clearToken: Ref<NodeJS.Timeout | undefined>
) {
	const config = useRuntimeConfig()

	const expPeriod = ms(config.public.jwtRefreshExp as StringValue)
	const advanceTime = ms('10s')

	const curTime = () => new Date().getTime()

	const timeLeft = refreshExp.value - curTime()

	if (timeLeft < advanceTime || Math.abs(timeLeft) > expPeriod) return false

	clearToken.value = persist()

	return true

	function persist() {
		return setTimeout(
			async () => {
				const { $api } = useNuxtApp()

				const result = await $api<Pick<UserTokenType, 'refreshExp'>>(
					'/api/auth/refresh',
					{
						method: 'POST',
						credentials: 'same-origin',
					}
				).catch((res: IFetchError) => res.status)

				if (typeof result === 'number') return

				refreshExp.value = result.refreshExp

				clearToken.value = persist()
			},
			refreshExp.value - curTime() - advanceTime
		)
	}
}
