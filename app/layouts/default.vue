<template>
	<v-app style="overflow: auto">
		<div :class="$style.box">
			<NavBanner tag="header" />
			<v-main :class="$style.main">
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
		width: 100%;
		height: 100vh;

		display: flex;
		flex-flow: column;
	}

	.main {
		flex: 1;

		margin: var.$nav-banner-height 0 0;
	}
</style>
