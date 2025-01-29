<template>
	<v-card
		:ripple="false"
		tag="article"
		class="bg-primary"
		:class="$style.card"
		@click.stop
	>
		<v-card-title :class="[$style.title, $style['select-none']]" tag="h2">
			<span>{{ alt }}</span>
		</v-card-title>
		<v-card-text :class="$style.text">
			<ImgZoom :class="$style.zoom" :alt :cur-img-data />
			<v-list
				:lines="false"
				tag="ul"
				:class="$style.list"
				class="pa-0 bg-surface-light"
			>
				<v-list-item
					v-for="{ title, value, appendIcon, url } of items"
					:key="title"
					tag="li"
				>
					<v-list-item-title tag="p" class="mb-2">
						{{ title }}:
					</v-list-item-title>
					<v-list-item-subtitle
						:tag="url ? 'a' : 'p'"
						:href="url"
						:target="url ? '_blank' : null"
						:rel="url ? 'noopener noreferrer' : null"
						:class="$style.subtitle"
					>
						{{ value }}
						<v-icon :icon="appendIcon" size="small"></v-icon>
					</v-list-item-subtitle>
				</v-list-item>
			</v-list>
		</v-card-text>
		<v-card-actions :class="$style.actions">
			<slot name="actions"></slot>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
	export type item = {
		title: string
		value: string | number
		url?: string
		appendIcon?: string
	}

	const { alt = '未命名' } = defineProps<{
		curImgData: ImgType
		items: item[]
		alt?: string
	}>()
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.card {
		cursor: default;
		height: 100%;
		display: grid;
		grid:
			'title actions'
			'text  text' 1fr
			/ 1fr auto;

		&:hover :global(.v-card__overlay) {
			opacity: 0;
		}
	}

	.title {
		grid-area: title;

		font-size: 1.5em;
		line-height: 2em;
		padding-left: 1em;
	}

	.actions {
		grid-area: actions;
	}

	.text {
		grid-area: text;

		display: flex;
		gap: 0.5em;
		overflow: hidden;

		@media (max-width: 700px) {
			flex-flow: column;
			overflow: hidden auto;
			scrollbar-width: thin;
		}
	}

	.zoom {
		flex: 0 50%;

		@media (max-width: 700px) {
			flex: none;
			height: 100%;
		}
	}

	.list {
		flex: 1;
		align-self: center;

		max-height: 100%;
		overflow: hidden auto !important;
		scrollbar-width: thin;
		border-radius: var.$radius !important;

		@media (max-width: 700px) {
			flex: none;
			max-height: none;
			width: 100%;
			overflow: hidden !important;
		}
	}

	.subtitle {
		margin-left: 1em;
		opacity: 1 !important;
	}
</style>
