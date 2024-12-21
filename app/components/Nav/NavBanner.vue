<template>
	<div :class="$style.box">
		<NavLogo />
	</div>
</template>

<script setup lang="ts">
	//
</script>

<style lang="scss" module>
	.box {
		display: flex;
		justify-content: space-between;
		padding: 0 1.5em;

		height: var.$nav-banner-height;
	}
</style>
