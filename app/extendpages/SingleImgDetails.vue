<template>
	<div>
		<Transition name="page">
			<div v-show="isOpen" :class="$style.wrapper" @click="toPush">
				<dialog open :class="$style.dialog">
					<ImgDetails :cur-img-data :items :alt>
						<template #actions>
							<v-btn icon="$close" @click="toPush"></v-btn>
						</template>
					</ImgDetails>
				</dialog>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({ pageTransition: { css: false, duration: 0 } })

	const route = useRoute('index-id')
	const { curImgData, items, alt } = await useIdPageData(`id${route.params.id}`)

	const title = computed(() =>
		curImgData.alt === '' ? '未命名' : curImgData.alt
	)

	useSeoMeta({
		title: title,
		ogTitle: title,
	})

	const isOpen = ref(false)

	onMounted(() => {
		setTimeout(() => (isOpen.value = true), 100)
	})

	onActivated(() => {
		setTimeout(() => (isOpen.value = true), 100)
	})

	onBeforeRouteLeave(
		() =>
			new Promise(res => {
				isOpen.value = false

				setTimeout(() => res(), 600)
			})
	)

	const name = route.name.slice(0, -3)

	assertRouteExist(name)

	const imgStore = useImageStore()

	const toPush = () => {
		return navigateTo({
			name,
			query: name === 'index' ? undefined : { theme: imgStore.curTheme },
		})
	}

	onKeyStroke('Escape', toPush, { target: document })
</script>

<style lang="scss" module>
	.wrapper {
		position: fixed;
		inset: 0;
		z-index: 5;
		backdrop-filter: blur(3px);
	}

	.dialog {
		position: absolute;
		inset: 0;
		margin: auto;

		height: 75vh;
		width: min(80dvw, var.$containerMaxWidth);
		border: none;
		border-radius: var.$radius;

		:root:has(&) {
			overflow: hidden;
		}
	}
</style>
