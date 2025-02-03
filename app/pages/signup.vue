<template>
	<v-card tag="article" :class="$style['form-wrapper']">
		<v-card-title tag="h1" class="text-center mb-2">註冊</v-card-title>
		<v-card-text>
			<v-form id="signup" ref="form" @submit.prevent="formHandler">
				<v-text-field
					v-model:model-value="username"
					class="mb-2"
					name="username"
					label="帳戶"
					placeholder="英文字母或數字"
					autocomplete="username"
					validate-on="blur lazy"
					:rules="[isRequired, isValidString, isUniqueUsername]"
					:maxlength="config.public.accountLength"
					counter
				></v-text-field>
				<v-text-field
					v-model:model-value="password"
					class="mb-2"
					name="password"
					placeholder="英文字母或數字"
					autocomplete="new-password"
					type="password"
					label="密碼"
					validate-on="blur"
					:rules="[isRequired, isDifferent(username), isValidString]"
					:maxlength="config.public.accountLength"
				></v-text-field>
				<v-text-field
					autocomplete="new-password"
					type="password"
					label="密碼確認"
					validate-on="blur"
					:rules="[useIsSame(password)]"
				></v-text-field>
			</v-form>
		</v-card-text>
		<v-card-actions class="flex-wrap justify-center px-4">
			<v-btn
				form="signup"
				type="submit"
				variant="tonal"
				class="text-center mb-2"
				style="flex: 100%"
				:loading="isLoading"
			>
				註冊
			</v-btn>
			<strong class="d-flex ga-2">
				<span>已有帳戶?</span>
				<NuxtLink :to="'/signin'" class="active">登入</NuxtLink>
			</strong>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
	import type { VForm } from 'vuetify/components'

	definePageMeta({
		auth: false,
	})

	const config = useRuntimeConfig()
	const title = '註冊'
	useSeoMeta({
		title,
		ogTitle: title,
		description: title + config.public.appName,
		ogDescription: title + config.public.appName,
	})

	const username = ref('')
	const password = ref('')

	const userStore = useUserStore()
	const formEl = useTemplateRef<VForm>('form')
	const isLoading = ref(false)

	const formHandler = async () => {
		isLoading.value = true

		assertIsDefined('formEl', formEl.value)
		const { valid } = await formEl.value.validate()

		if (!valid) {
			isLoading.value = false

			return
		}

		const isSuccess = await userStore.createUser(username.value, password.value)

		if (isSuccess) {
			useState<IAlert[]>('alertList').value.push({
				type: 'success',
				title: '成功註冊',
				id: nanoid(5),
			})

			await navigateTo('/signin')

			return
		}

		isLoading.value = isSuccess
	}
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';
</style>
