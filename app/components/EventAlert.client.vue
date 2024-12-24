<template>
	<section
		v-show="hasAlert"
		ref="wrapper"
		:class="[$style.wrapper, $style['select-none']]"
	>
		<v-alert
			v-for="({ type, title, text, id }, index) of msgList"
			ref="alert"
			:key="id"
			:class="[$style.alert, { active: pressIndex === index }]"
			:type
			:title
			:text
			closable
			width="350"
			class="my-2 mx-auto"
			tag="p"
			@mousedown="pressIndex = index"
			@mouseleave="pressIndex = null"
			@mouseup="pressIndex = null"
			@pointerdown="pressIndex = index"
			@pointerleave="pressIndex = null"
			@pointerup="pressIndex = null"
		>
			<template #close>
				<v-btn icon="$close" @click="useEventAlertClose($event)"></v-btn>
			</template>
		</v-alert>
	</section>
</template>

<script setup lang="ts">
	import type { VAlert } from 'vuetify/components'

	const { $useAlert } = useNuxtApp()
	const { alertList, msgList, spliceMsgList } = $useAlert()

	const hasAlert = computed(() => alertList.value.length > 0)

	let tid: NodeJS.Timeout
	const alertEls = useTemplateRef<VAlert[]>('alert')

	onMounted(() => {
		watch(
			alertList,
			arr => {
				if (tid) clearTimeout(tid)

				if (arr.length === 0) return

				tid = setTimeout(async () => {
					assertIsDefined('alertEls.value', alertEls.value)

					const el = alertEls.value[0]?.$el

					assertIsHTMLElement(el)

					await spliceMsgList(
						() =>
							new Promise<void>(res => {
								el.classList.add('right')
								el.classList.add('active')

								tid = setTimeout(() => res(), 2100)
							})
					)
				}, 3000)
			},
			{ deep: true, immediate: true }
		)
	})

	const wrapperEl = useTemplateRef('wrapper')
	const { x, elementWidth, isOutside } = useMouseInElement(wrapperEl, {
		handleOutside: false,
	})

	const pressIndex = ref<number | null>(null)

	const maxOffset = computed(() => elementWidth.value / 4)

	let initPosX: number | null = null
	let movement: number | null = null

	onMounted(() => {
		watch([x, pressIndex], async ([posX, index], [_, oldIndex]) => {
			if (
				isOutside.value ||
				(index === null && oldIndex === null) ||
				!alertEls.value ||
				alertEls.value.length === 0
			)
				return

			if (index !== null) {
				if (initPosX === null) {
					initPosX = posX

					return
				}

				const el = alertEls.value[index]

				assertIsDefined('el', el)
				assertIsHTMLElement(el.$el)

				movement = posX - initPosX

				let dynamicOpacity =
					1 - +((Math.abs(movement) * 100) / (maxOffset.value * 100)).toFixed(2)

				dynamicOpacity = dynamicOpacity < 0 ? 0 : dynamicOpacity

				if (initPosX !== null)
					Object.assign(alertEls.value![index]!.$el.style, {
						transform: `translateX(${movement}px)`,
						opacity: `${dynamicOpacity}`,
					} as CSSStyleDeclaration)
			}

			if (index === null && oldIndex !== null) {
				initPosX = null

				const el = alertEls.value[oldIndex]?.$el

				assertIsHTMLElement(el)

				if (parseFloat(el.style.opacity) < 0.3) {
					await spliceMsgList(
						() =>
							new Promise<void>(res => {
								el.style.opacity = '0'

								setTimeout(() => res(), 1500)
							})
					)

					return
				}

				Object.assign(alertEls.value![oldIndex]!.$el.style, {
					transform: '',
					transition: '',
					opacity: '',
				} as CSSStyleDeclaration)
			}
		})
	})
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.wrapper {
		position: fixed;
		z-index: 5;
		right: 2rem;
		bottom: 0.5rem;

		@media (max-width: 400px) {
			inset: auto 0 0.5rem;
			margin: auto;
		}
	}

	.alert {
		$time: 2s;

		transform: translateX(0);
		opacity: 1;

		transition:
			transform $time,
			opacity $time;

		&:global(.active) {
			opacity: 0.85;

			&:global(.right) {
				opacity: 0;
				transform: translateX(100%);
			}
		}
	}
</style>
