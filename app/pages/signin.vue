<template>
	<v-card tag="article" :class="$style['form-wrapper']">
		<v-card-title tag="h1" class="text-center mb-2">登入</v-card-title>
		<v-card-text>
			<v-form id="signin" ref="form" @submit.prevent="formHandler">
				<v-text-field
					v-model="username"
					name="username"
					label="帳戶"
					autocomplete="username"
					:rules="[isRequired]"
				></v-text-field>
				<v-text-field
					v-model="password"
					:rules="[isRequired]"
					name="password"
					type="password"
					label="密碼"
					autocomplete="current-password"
				></v-text-field>
			</v-form>
		</v-card-text>
		<v-card-actions class="flex-wrap justify-center px-4">
			<v-btn
				form="signin"
				type="submit"
				variant="tonal"
				class="text-center mb-2"
				style="flex: 100%"
				:loading="isLoading"
			>
				登入
			</v-btn>
			<strong class="d-flex ga-2">
				<span>還沒註冊?</span>
				<NuxtLink :to="'/signup'" class="active">註冊</NuxtLink>
			</strong>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
	import type { VForm } from 'vuetify/components'

	definePageMeta({
		auth: false,
	})

	const title = '登入'

	useSeoMeta({
		title,
		ogTitle: title,
	})

	const username = ref('')
	const password = ref('')

	const userStore = useUserStore()
	const formEl = useTemplateRef<VForm>('form')

	userStore.$subscribe((_, { userData }) => {
		if (userData !== null) navigateTo('/gallery')
	})

	const isLoading = ref(false)

	const formHandler = async () => {
		isLoading.value = true

		assertIsDefined('formEl', formEl.value)
		const { valid } = await formEl.value.validate()

		if (!valid) {
			isLoading.value = false
			return
		}

		const isSuccess = await userStore.signin(username.value, password.value)

		if (!isSuccess) {
			isLoading.value = false
			return
		}

		useState<IAlert[]>('alertList').value.push({
			type: 'success',
			title: '成功登入',
			id: nanoid(5),
		})

		await navigateTo('/gallery')
	}
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';
</style>
