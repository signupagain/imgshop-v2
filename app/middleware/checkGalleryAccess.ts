export default defineNuxtRouteMiddleware((to, from) => {
	if (!('id' in to.params)) return

	const ownIdRoute: RouteNameArr = ['index', 'search']

	if (!ownIdRoute.includes(from.name)) return

	const name = `${from.name}-id` as const

	assertRouteExist(name)

	if (to.name === name) return

	return navigateTo({ name, params: { id: to.params.id } })
})
