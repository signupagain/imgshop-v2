<template>
	<NuxtLayout>
		<NuxtPage />
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
</script>
