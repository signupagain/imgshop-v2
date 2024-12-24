<template>
	<div :class="$style.box" class="bg-surface elevation-5">
		<NavLogo />
		<v-btn
			icon="$theme"
			variant="flat"
			:ripple="false"
			@click="toggleTheme"
		></v-btn>
	</div>
</template>

<script setup lang="ts">
	const theme = useTheme()

	const toggleTheme = () => {
		theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
	}
</script>

<style lang="scss" module>
	.box {
		display: flex;
		justify-content: space-between;
		align-items: center;

		position: fixed;
		inset: 0 0 auto;
		z-index: 5;
		height: var.$nav-banner-height;
		padding: 0 1.5em;
	}
</style>
