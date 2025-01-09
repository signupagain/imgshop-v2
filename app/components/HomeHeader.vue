<template>
	<header>
		<NavBanner />
		<div :class="$style.box">
			<div :class="$style.space"></div>
			<h1
				:class="[$style.title, $style['select-none']]"
				class="on-surface"
				v-text="$config.public.appName"
			></h1>
			<SearchBar :class="$style.bar" />
			<BgBoxImage />
		</div>
	</header>
</template>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.box {
		display: flex;
		align-items: center;
		flex-flow: column;
		gap: 1em;

		position: relative;
		z-index: 1;

		height: calc(100vh - var.$nav-banner-height);
		min-height: 38rem;
		margin: var.$nav-banner-height 0 0;
	}

	.space {
		--percent: 38%;
		flex: 0 1 calc(var(--percent) - 3.5rem);

		@media (min-width: 1010px) {
			--percent: 32%;
		}
	}

	.title {
		font-family: 'Protest Strike';
		line-height: 1.1;
		font-size: clamp(3rem, 15vw, 9rem);

		margin: 0 var.$scrollbarOffset 0 0;
	}

	.bar {
		width: clamp(14rem, 70%, 47rem);
		margin: 0 var.$scrollbarOffset 0 0;
	}

	@media (max-width: 600px) {
		.title,
		.bar {
			margin: 0;
		}
	}
</style>
