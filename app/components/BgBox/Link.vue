<template>
	<a
		:title="by"
		:href
		target="_blank"
		rel="noopener noreferrer"
		:class="$style.wrapper"
		class="active"
	>
		<strong :class="$style.str" v-text="by"></strong>
		<v-icon icon="$link" :size="'1.1em'"></v-icon>
	</a>
</template>

<script setup lang="ts">
	defineProps<{
		by: string
		href: string
	}>()
</script>

<style lang="scss" module>
	.wrapper {
		--color: var(--v-theme-on-primary);

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;

		padding: 2px 5px;
		border-radius: var.$radius;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: contrast(50%);
	}

	.str {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		-webkit-line-clamp: 2;

		max-height: 3em;
		transition: max-height 0.5s;

		&:hover {
			max-height: 10em;
			line-clamp: none;
			-webkit-line-clamp: none;
		}
	}
</style>
