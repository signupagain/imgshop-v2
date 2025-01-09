<template>
	<component :is="tag" :class="$style.box" class="bg-surface elevation-5">
		<div class="bg-surface" :class="$style.content">
			<NavLogo />
			<div :class="$style.wrapper">
				<SearchBar
					v-if="isSwitch && isExist"
					variant="outlined"
					class="bg-surface"
				/>
			</div>
			<NavMenu
				:is-show-search-btn="!isSwitch && isExist"
				:window-width="width"
			/>
		</div>
	</component>
</template>

<script setup lang="ts">
	import type { IntrinsicElementAttributes } from 'vue'

	const { tag = 'div' } = defineProps<{
		tag?: keyof IntrinsicElementAttributes
	}>()

	const route = useRoute()
	const error = useError()

	const { y } = useWindowScroll()
	const { width } = useWindowSize()
	const routePrefix = ['search', 'user']
	const excludesRoutes: RouteNameArr = ['signup', 'signin']

	const isError = computed(() => !!error.value)

	const isExist = computed(
		() =>
			isError.value ||
			routePrefix.some(val => route.name === val) ||
			(!excludesRoutes.includes(route.name) && y.value >= 600)
	)

	const isSwitch = computed(() => width.value >= 700)
</script>

<style lang="scss" module>
	.box {
		position: fixed;
		inset: 0 0 auto;
		z-index: 5;
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: calc(100dvw - var.$scrollbarOffset - 5px);
		height: var.$nav-banner-height;
		padding: 0 1em;

		@media (max-width: 400px) {
			padding-right: 0.5em;
		}
	}

	.wrapper {
		flex: 0 50%;

		max-height: 40px;

		@media (pointer: none), (pointer: coarse) {
			max-height: 48px;
		}
	}
</style>
