export default defineNuxtRouteMiddleware(async to => {
	if (import.meta.client && typeof to.meta.auth === 'boolean') {
		const userStore = useUserStore()

		await userStore.autoSignin()

		if (to.meta.auth === true && !userStore.userData) {
			return navigateTo('/signin')
		}

		if (to.meta.auth === false && userStore.userData)
			return navigateTo('/gallery')
	}
})
