<template>
	<v-app style="overflow: auto">
		<div :class="$style.box">
			<NavBanner tag="header" />
			<slot />
			<AppFooter />
		</div>
	</v-app>
</template>

<script setup lang="ts">
	//
</script>

<style lang="scss" module>
	.box {
		width: var.$maxContentWidth;
		min-height: 100vh;
		margin: auto;

		display: flex;
		flex-flow: column;
	}
</style>

<style lang="scss" scoped>
	:slotted(div) {
		flex: 1;
		margin: var.$nav-banner-height 0 0;
	}
</style>
