<template>
	<div>
		<ImgGallery tag="h2" />
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'home',
		middleware: [
			'check-img-theme',
			'check-gallery-access',
			'handle-details-page-transition',
		],
	})

	const config = useRuntimeConfig()

	useSeoMeta({
		title: config.public.appName,
		ogTitle: config.public.appName,
		description: config.public.appName + ' — 簡易圖集商城',
		ogDescription: config.public.appName + ' — 簡易圖集商城',
	})
</script>

<style lang="scss" module>
	//
</style>
