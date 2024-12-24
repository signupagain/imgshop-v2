<template>
	<v-app style="overflow: auto">
		<div :class="$style.box">
			<NavBanner />
			<v-main class="flex-1">
				<BgBox>
					<slot />
				</BgBox>
			</v-main>
			<AppFooter />
		</div>
	</v-app>
</template>

<style lang="scss" module>
	.box {
		width: min(100%, 1800px);
		height: 100dvh;
		margin: auto;

		display: flex;
		flex-flow: column;
	}
</style>
