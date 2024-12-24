<template>
	<div :class="[$style.box, $style['select-none']]">
		<v-img :class="$style.img" :src="img.src" cover />
		<BgBoxLink :class="$style.label" :by="img.by" :href="img.from" />
	</div>
</template>

<script setup lang="ts">
	const { customBg } = defineProps<{
		customBg?: IBgBoxSrc
	}>()

	const theme = useTheme()
	const isDark = computed(() => theme.current.value.dark)

	const { dark, light } = useFixedBg
	const img = computed(() =>
		customBg ? customBg
		: isDark.value ? dark
		: light
	)
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';
	@use 'sass:math';

	.box,
	.img {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.label {
		$offset: 2em;

		position: absolute;
		right: $offset;
		bottom: $offset;

		@media (max-width: 300px) {
			inset: auto 0 $offset;
			margin: auto;
			transform: translateX(-(math.div(var.$scrollbarOffset, 2)));

			width: fit-content;
		}
	}
</style>
