export const throwNotFound: () => never = () => {
	throw createError({ statusCode: 404, message: '該頁不存在' })
}

export const throwServerError: () => never = () => {
	throw createError('伺服器異常')
}

export const throwFormatError: () => never = () => {
	throw createError({ statusCode: 400, message: '格式錯誤' })
}

export const throwSameUsernameError: () => never = () => {
	throw createError({ statusCode: 400, message: '已被使用，請更換' })
}

export const throwUnauthorization: () => never = () => {
	throw createError({ status: 401, message: '未授權' })
}
