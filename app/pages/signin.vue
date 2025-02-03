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
					:error-messages
					@input="errorMessages = ''"
				></v-text-field>
				<v-text-field
					v-model="password"
					:rules="[isRequired]"
					:error-messages
					name="password"
					type="password"
					label="密碼"
					autocomplete="current-password"
					@input="errorMessages = ''"
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

	const errorMessages = ref('')

	const isLoading = ref(false)

	const formHandler = async () => {
		const list = useState<IAlert[]>('alertList')

		const id = nanoid(5)

		const tid = setTimeout(() => {
			list.value.push({
				id,
				type: 'info',
				title: '就快好了，再等一下下',
			})
		}, 3000)

		isLoading.value = true
		const badResult = '帳號或密碼有誤'

		assertIsDefined('formEl', formEl.value)
		const { valid } = await formEl.value.validate()

		if (!valid) {
			isLoading.value = false
			errorMessages.value = badResult
			clearTimeout(tid)

			return
		}

		const isSuccess = await userStore.signin(username.value, password.value)

		if (!isSuccess) {
			isLoading.value = false
			errorMessages.value = badResult
			clearTimeout(tid)

			return
		}

		clearTimeout(tid)

		const deleteIndex = list.value.findIndex(msg => msg.id === id)

		if (deleteIndex !== -1) list.value.splice(deleteIndex, 1)

		list.value.push({
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
