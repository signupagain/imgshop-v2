<template>
	<dialog ref="dialog" :class="$style.dialog" @click="toPush">
		<ImgDetails :cur-img-data :items :alt>
			<template #actions>
				<v-btn icon="$close" @click="toPush"></v-btn>
			</template>
		</ImgDetails>
	</dialog>
</template>

<script setup lang="ts">
	const route = useRoute('index-id')

	const { curImgData, items, alt } = await useIdPageData(`id${route.params.id}`)

	const dialog = useTemplateRef('dialog')

	onMounted(() => {
		assertIsDefined('dialog', dialog.value)
		dialog.value.showModal()

		dialog.value.scroll({ top: 0 })
	})

	const name = route.name.slice(0, -3)
	assertRouteExist(name)

	const imgStore = useImageStore()

	const toPush = () =>
		navigateTo({
			name,
			query: name === 'index' ? undefined : { theme: imgStore.curTheme },
		})

	onKeyStroke('Escape', toPush, { target: document })
</script>

<style lang="scss">
	:root:has(dialog) {
		overflow-y: scroll !important;
	}
</style>

<style lang="scss" module>
	.dialog {
		height: 85vh;
		width: min(80dvw, var.$containerMaxWidth);
		border: none;
		margin: auto;
		border-radius: var.$radius;

		&::backdrop {
			backdrop-filter: blur(3px);
		}

		:root:has(&) {
			overflow: hidden;
		}
	}
</style>
