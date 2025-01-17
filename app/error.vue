<template>
	<NuxtLayout name="default">
		<v-card :class="$style.card">
			<v-card-title class="text-h2" :class="$style.subtitle">
				{{ error.statusCode }}
			</v-card-title>
			<v-card-subtitle :class="$style.subtitle">
				{{ error.message }}
			</v-card-subtitle>
			<v-card-actions class="justify-center">
				<v-btn tag="a" href="/" to="/" class="elevation-2 mt-3">回到主頁</v-btn>
			</v-card-actions>
		</v-card>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import type { NuxtError } from '#app'

	const { error } = defineProps<{ error: NuxtError }>()
	const config = useRuntimeConfig()

	useSeoMeta({
		title: config.public.appName + ' — ' + error.message,
		ogTitle: config.public.appName + ' — ' + error.message,
	})

	onBeforeRouteLeave(async () => {
		await clearError()
	})
</script>

<style lang="scss" module>
	.card {
		text-align: center;
		padding: 40px;
		max-width: 500px;
		max-height: 600px;
	}

	.subtitle {
		font-weight: 900 !important;
		white-space: wrap !important;
		overflow: auto;
	}
</style>
