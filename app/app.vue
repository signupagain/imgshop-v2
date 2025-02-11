<template>
	<NuxtLayout>
		<NuxtPage :page-key="route => route.fullPath" />
	</NuxtLayout>
	<EventAlert />
</template>

<script setup lang="ts">
	const userStore = useUserStore()

	if (import.meta.client) {
		useThrottledResizeObserver()

		userStore.autoSignin()
	}

	const { isSignin, userData } = storeToRefs(userStore)

	const route = useRoute()

	watch([() => route.name, isSignin], async ([routeName, status]) => {
		if (status) return

		if (routeName !== 'gallery' && userData.value) await userStore.signout()
	})

	const router = useRouter()
	const imgStore = useImageStore()

	router.afterEach(to => {
		if (to.name === 'index') imgStore.curTheme = ''
		if (to.name === 'search') imgStore.curTheme = to.query.theme as string
	})
</script>
