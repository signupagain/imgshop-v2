export const throwNotFound: () => never = () => {
	throw createError({ statusCode: 404, message: '該頁不存在' })
}

export const throwServerError: () => never = () => {
	throw createError('伺服器異常')
}
