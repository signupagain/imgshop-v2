<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<EventAlert />
</template>

<script setup lang="ts">
	const isActive = useState<boolean>('appPageOnAfterEnter', () => false)

	const userStore = useUserStore()

	if (import.meta.client) {
		useThrottledResizeObserver()

		userStore.autoSignin()
	}

	const { isSignin, userData } = storeToRefs(userStore)

	const router = useRouter()

	watch([router.currentRoute, isSignin], async ([route, status]) => {
		if (status) return

		if (route.name !== 'gallery' && userData.value) await userStore.signout()
	})
</script>
