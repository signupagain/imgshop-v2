import { TokenKey } from '~~/shared/params/tokenKey'

export default eventHandler({
	async handler(event) {
		deleteCookie(event, TokenKey.refresh)

		setResponseStatus(event, 204, '成功登出')

		return null
	},
})
