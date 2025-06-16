<template>
	<div
		style="display: grid; place-items: center"
		:style="{ opacity: isActive ? 0 : 1 }"
	>
		<div class="">
			<h1>當前路徑: {{ currentRoute.path }}</h1>
			<br />
			<input
				:class="$style.input"
				ref="el"
				type="text"
				:value="state"
				@change="nav"
			/>
		</div>
	</div>
</template>

<script setup>
	const { currentRoute } = useRouter()

	const state = test()

	const el = useTemplateRef('el')

	const isActive = ref(false)

	onMounted(() => {
		el.value?.focus()
		isActive.value = false
	})

	async function nav(e) {
		state.value = e.target.value

		isActive.value = true

		await nextTick()

		return navigateTo({ path: '/test/' + state.value, redirectCode: 418 })
	}
</script>

<style lang="scss" module>
	.input {
		border: solid #ccc;
	}
</style>
