<template>
	<ImgDialog />
</template>

<script setup lang="ts">
	import { DETAILS_PATH } from '#shared/constants/route'

	definePageMeta({
		key: route => route.fullPath,
		path: `${DETAILS_PATH}/:id(\\d+)`,
	})
</script>

<style lang="scss" module>
	//
</style>
