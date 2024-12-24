<template>
	<v-card>
		<v-card-title>{{ title }}</v-card-title>
		<v-card-text></v-card-text>
	</v-card>
</template>

<script setup lang="ts">
	const { title = '精選圖集' } = defineProps<{
		title: string
	}>()
</script>

<style lang="scss" module>
	//
</style>
