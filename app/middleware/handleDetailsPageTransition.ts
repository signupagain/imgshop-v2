export default defineNuxtRouteMiddleware((to, from) => {
	if (!to.name || !from.name) return

	if (to.name.endsWith('-id') || from.name.endsWith('-id'))
		to.meta.pageTransition = false
})
