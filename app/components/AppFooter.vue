<template>
	<footer class="text-center pa-1">
		<strong :class="$style['select-none']">
			{{ $config.public.appName }} - {{ new Date().getFullYear() }}
		</strong>
	</footer>
</template>

<style lang="scss" module>
	@use 'assets/scss/utils.module';
</style>
