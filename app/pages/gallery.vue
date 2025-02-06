<template>
	<div :class="$style.wrapper">
		<v-card ref="card" :class="$style.item">
			<ClientOnly>
				<v-text-field
					v-if="isEdit"
					v-model:model-value="inputValue"
					class="ma-2"
					density="compact"
					append-inner-icon="$edit"
					hide-details
					variant="outlined"
					:center-affix="true"
					:clearable="true"
					:placeholder="name"
					:autofocus="true"
					@click:append-inner="setName"
					@keyup.enter="setName"
					@keyup.esc="isEdit = false"
				></v-text-field>
				<v-card-title
					v-else
					class="text-center cursor-pointer"
					tag="h1"
					@click="isEdit = true"
				>
					{{ name }}
				</v-card-title>
			</ClientOnly>
		</v-card>
		<UserGallery
			:class="[$style.item]"
			class="flex-1-0-0"
			:img-map="userStore.userData?.imgMap"
		/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		auth: true,
	})

	const title = '個人頁面'

	useSeoMeta({
		title,
		ogTitle: title,
	})

	const userStore = useUserStore()

	const isEdit = ref(false)

	const card = useTemplateRef('card')
	onClickOutside(card, () => (isEdit.value = false))

	const inputValue = ref('')

	const name = computed(() =>
		userStore.userData === null ? ''
		: userStore.userData.name && userStore.userData.name !== '' ?
			userStore.userData.name
		:	userStore.userData.username
	)

	const setName = async () => {
		if (inputValue.value === '' || userStore.userData == null) return

		const isSuccess = await userStore.updateUserData({ name: inputValue.value })

		if (!isSuccess) {
			userStore.isSignin = false

			await navigateTo('/')

			return
		}

		userStore.userData.name = inputValue.value

		isEdit.value = false
	}
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.wrapper {
		display: flex;
		flex-flow: column;
		justify-content: space-between;
		gap: 1em;

		width: min(1200px, 90%);
		height: 100%;
		padding: 2em 0 4em;
	}

	.item {
		border-radius: var.$radius;
	}
</style>
