<template>
	<section
		ref="box"
		:class="[$style.edge, $style['select-none']]"
		class="bg-surface"
		@click="active = !active"
	>
		<v-img
			ref="img"
			crossorigin="anonymous"
			:class="[$style.img, { active }]"
			:alt
			:src="curImgData.src.large2x"
			:lazy-src="curImgData.src.small"
			:style="[
				active ? pos : null,
				{ aspectRatio: (curImgData.width / curImgData.height).toFixed(2) },
			]"
		>
			<template #placeholder>
				<div :class="$style.placeholder">
					<v-progress-circular
						color="primary"
						indeterminate
						size="50"
						width="10"
					></v-progress-circular>
				</div>
			</template>
		</v-img>
	</section>
</template>

<script setup lang="ts">
	defineProps<{
		alt: string
		curImgData: ImgType
	}>()

	const active = ref(false)

	const imgEl = useTemplateRef<ComponentPublicInstance>('img')

	const { elementWidth: width, elementHeight: height } = useMouseInElement(
		imgEl,
		{ handleOutside: false }
	)
	const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(
		useTemplateRef('box')
	)

	const throttleElX = throttledRef(elementX, 50)
	const throttleElY = throttledRef(elementY, 50)

	const offset = (
		mousePos: Ref<number> | number,
		frameLength: Ref<number> | number,
		scaleImgLength: Ref<number> | number
	): string => {
		frameLength = toValue(frameLength) - 2 // minus border width

		let offsetPos = -(toValue(mousePos) - frameLength / 2)

		const margin = 25
		const maxOffset = frameLength / 2 - margin
		const maxScaleOffset = toValue(scaleImgLength) / 2 - margin
		const ratio = Math.round(maxScaleOffset / maxOffset) / 2.5

		if (Math.abs(offsetPos) > maxOffset) {
			offsetPos = offsetPos > 0 ? maxOffset : -maxOffset
		}

		const offset = offsetPos * ratio

		return offset.toFixed(2) + 'px'
	}

	const pos = ref<{
		transform: string
	}>()

	watch([throttleElX, throttleElY], ([x, y]) => {
		pos.value = {
			transform: `scale(2) translate(${offset(x, elementWidth, width)},${offset(y, elementHeight, height)})`,
		}
	})
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.edge {
		cursor: pointer;
		overflow: hidden;
		position: relative;
		padding: 1px;
		border-radius: var.$radius;

		display: grid;
		place-items: center;
	}

	.img {
		width: 100%;
		height: 100%;

		transition: transform 0.4s 0.1s linear;

		&:global(.active) {
			transform: scale(2);
		}
	}
</style>
