<template>
	<NuxtLink
		to="/"
		class="d-flex align-center text-h5"
		:class="$style['select-none']"
		:title="$config.public.appName"
	>
		<v-img
			width="2em"
			:src="logo"
			:alt="`相機的描邊，它是${$config.public.appName}的Logo`"
			:class="$style.img"
		/>
		<strong
			:class="$style.title"
			class="on-surface"
			v-text="$config.public.appName"
		></strong>
	</NuxtLink>
</template>

<script setup lang="ts">
	import logo from 'assets/logo.svg'
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	:global(.v-theme--dark) .img {
		filter: invert(1);
	}
</style>
