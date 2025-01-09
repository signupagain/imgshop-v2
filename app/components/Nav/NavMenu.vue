<template>
	<component
		:is
		:class="{ [$style.box]: !isSmallest }"
		location="bottom center"
		:close-on-content-click="false"
	>
		<template v-if="isSmallest" #activator="{ props: props }">
			<v-btn icon="$menu" v-bind="props" size="small" variant="flat"></v-btn>
		</template>
		<div :class="$style['menu-spacer']"></div>
		<v-dialog v-model="isDialogOpen" max-width="500" :transition="false">
			<template #activator="{ props }">
				<v-btn
					v-if="isShowSearchBtn"
					v-bind="props"
					:variant
					icon="$search"
					:size
					:class="$style['menu-item']"
					class="bg-surface"
					@click="isSearchBarOpen = true"
				></v-btn>
			</template>
			<template #default>
				<div
					:class="$style.dialog"
					class="pa-3 bg-primary"
					@click="isSearchBarOpen = true"
				>
					<SearchBar
						v-model:is-open="isSearchBarOpen"
						v-model:is-loading="isLoading"
					/>
				</div>
			</template>
		</v-dialog>
		<v-menu open-on-click :location :class="$style['menu-item']">
			<template #activator="{ props }">
				<v-btn
					class="bg-surface"
					:size
					icon="$account"
					:variant
					v-bind="props"
				></v-btn>
			</template>
			<nav :class="$style['account-menu']">
				<template v-if="userData">
					<v-btn tag="a" href="/gallery" to="/gallery">個人頁面</v-btn>
					<v-btn class="text-error" @click="signout">登出</v-btn>
				</template>
				<template v-else>
					<v-btn tag="a" href="/signin" :rounded="false" to="/signin">
						登入
					</v-btn>
					<v-btn tag="a" href="/signup" :rounded="false" to="/signup">
						註冊
					</v-btn>
				</template>
			</nav>
		</v-menu>
		<v-btn
			class="bg-surface"
			:class="$style['menu-item']"
			:size
			icon="$theme"
			:variant
			:ripple="false"
			@click="toggleTheme"
		></v-btn>
	</component>
</template>

<script setup lang="ts">
	import { VMenu } from 'vuetify/components'

	const { windowWidth } = defineProps<{
		isShowSearchBtn: boolean
		windowWidth: number
	}>()

	const isSearchBarOpen = ref(true)

	const isSmallest = computed(() => windowWidth <= 400)

	const is = computed(() => (isSmallest.value ? VMenu : 'div'))

	const size = computed(() => (isSmallest.value ? 'small' : 'default'))

	const location = computed(() =>
		isSmallest.value ? 'start center' : 'bottom center'
	)

	const variant = computed(() => (isSmallest.value ? 'outlined' : 'flat'))

	const isLoading = ref(false)

	const isDialogOpen = ref(false)

	watch(isLoading, val => (isDialogOpen.value = val))

	const theme = useTheme()

	const toggleTheme = () =>
		(theme.global.name.value =
			theme.global.current.value.dark ? 'light' : 'dark')

	const userStore = useUserStore()
	const { userData, isSignin } = storeToRefs(userStore)

	const route = useRoute()

	const signout = async () => {
		isSignin.value = false

		if (route.name === 'gallery') await navigateTo('/')
	}
</script>

<style lang="scss" module>
	.box {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.menu-item {
		@media (max-width: 400px) {
			margin: 0.5em 0;
		}
	}

	.menu-spacer {
		@media (max-width: 400px) {
			height: 0.5em;
		}
	}

	.dialog {
		border-radius: var.$radius;
	}

	.account-menu {
		display: flex;
		flex-flow: column;

		margin: 0.5em;
		overflow: hidden;
		border-radius: var.$radius;
	}
</style>
