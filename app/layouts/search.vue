<template>
	<v-app style="overflow: auto">
		<div :class="$style.box">
			<NavBanner tag="header" />
			<main :class="$style.main">
				<slot />
			</main>
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

	.main {
		flex: 1;
		margin: var.$nav-banner-height 0 0;
	}
</style>

<style lang="scss" scoped>
	:slotted(div) {
		height: 100%;
	}
</style>
