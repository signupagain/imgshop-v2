<template>
	<div>
		<ImgGallery />
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'search',
		middleware: ['check-img-theme', 'check-gallery-access'],
	})

	const config = useRuntimeConfig()
	const route = useRoute('search')
	const theme = route.query.theme

	useSeoMeta({
		title: theme + '的搜尋結果',
		ogTitle: theme + '的搜尋結果',
		description: `在${config.public.appName}上搜尋—${theme}`,
		ogDescription: `在${config.public.appName}上搜尋—${theme}`,
	})
</script>

<style lang="scss" module>
	//
</style>
