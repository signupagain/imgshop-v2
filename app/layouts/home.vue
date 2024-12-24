<template>
	<v-app>
		<div :class="$style.wrapper">
			<HomeHeader />
			<v-main>
				<slot />
			</v-main>
			<AppFooter />
		</div>
	</v-app>
</template>

<style lang="scss" module>
	.wrapper {
		margin: auto;
		width: var.$maxContentWidth;
	}
</style>
