<template>
	<div :class="$style.wrapper">
		<slot />
		<BgBoxImage :custom-bg />
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		customBg?: IBgBoxSrc
	}>()
</script>

<style scoped>
	:slotted(article:has(form)) {
		width: min(500px, 100%);
		padding: 0.5em 1em;
		margin: 2em;
	}
</style>

<style lang="scss" module>
	.wrapper {
		position: relative;
		z-index: 1;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
