<template>
	<v-card>
		<v-card-text
			v-if="revImgMap.length === 0"
			:class="[$style.empty, $style['select-none']]"
		>
			<strong class="text-h1">
				<span class="text-no-wrap">尚無</span>
				<wbr />
				<span class="text-no-wrap">收藏</span>
			</strong>
		</v-card-text>
		<swiper-container v-else ref="container" :init="false" class="h-100">
			<swiper-slide v-for="[key, curImgData] of revImgMap" :key>
				<div :class="$style.details">
					<ImgDetails
						:cur-img-data
						:alt="
							!curImgData.alt || curImgData.alt === '' ?
								'未命名'
							:	curImgData.alt
						"
						:items="[
							{
								title: '作品名',
								value:
									!curImgData.alt || curImgData.alt === '' ?
										'未命名'
									:	curImgData.alt,
							},
							{
								title: '寬度',
								value: curImgData.width,
							},
							{ title: '高度', value: curImgData.height },
							{
								title: '攝影師',
								value: curImgData.photographer,
								url: curImgData.photographer_url,
								appendIcon: '$link',
							},
							{
								title: '圖片來源',
								value: 'Pexels',
								url: curImgData.url,
								appendIcon: '$link',
							},
						]"
					>
						<template #actions>
							<v-menu open-on-hover>
								<template #activator="{ props }">
									<v-btn
										icon="$dot"
										:class="$style['fix-outline']"
										v-bind="props"
										class="pa-0 mr-3"
										variant="tonal"
									></v-btn>
								</template>
								<template #default>
									<div class="mt-2 d-flex flex-column ga-2">
										<v-dialog close-on-content-click :transition="false">
											<template #activator="{ props }">
												<v-btn
													icon="$fullscreen"
													:ripple="false"
													v-bind="props"
												></v-btn>
											</template>
											<template #default>
												<v-img
													crossorigin="anonymous"
													:style="{
														aspectRatio: (
															curImgData.width / curImgData.height
														).toFixed(2),
													}"
													:alt="curImgData.alt ?? '未命名'"
													:src="curImgData.src.original"
													:lazy-src="curImgData.src.small"
													max-height="calc(100vh - 24px * 2)"
													max-width="calc(100dvw - 24px * 2)"
												></v-img>
											</template>
										</v-dialog>
										<v-btn
											icon="$close"
											class="bg-error"
											@click="deleteImg(key)"
										></v-btn>
									</div>
								</template>
							</v-menu>
						</template>
					</ImgDetails>
				</div>
			</swiper-slide>
		</swiper-container>
	</v-card>
</template>

<script setup lang="ts">
	import type { SwiperContainer } from 'swiper/element'
	import { EffectCoverflow, Keyboard, Scrollbar } from 'swiper/modules'
	import type { SwiperOptions } from 'swiper/types'

	const { imgMap } = defineProps<{ imgMap: ClientUserData['imgMap'] }>()

	const revImgMap = computed(() =>
		imgMap ? Array.from(imgMap.entries()).reverse() : []
	)

	const container = useTemplateRef<SwiperContainer>('container')

	const options: SwiperOptions = {
		speed: 1000,
		slidesPerView: 1,
		modules: [Scrollbar, EffectCoverflow, Keyboard],
		scrollbar: {
			draggable: true,
			dragSize: 50,
		},
		effect: 'coverflow',
		coverflowEffect: {
			slideShadows: false,
		},
		keyboard: { enabled: true },
		a11y: {},
		observer: true, // solve navigation jump twice. (Don't import Navigation)
		navigation: {},
	}

	watch(
		container,
		el => {
			if (!el) return

			Object.assign(el, options)

			el?.initialize()
		},
		{ once: true }
	)

	const userStore = useUserStore()

	const deleteImg = async (id: `id${string}`) => {
		const isSuccess = await userStore.updateUserData({ patchImgList: [id] })

		if (!isSuccess) {
			userStore.isSignin = false

			await navigateTo('/')

			return
		}

		userStore.$patch(({ userData }) => {
			const idIndex = userData?.ownList?.findIndex(val => val === id)

			if (typeof idIndex === 'number' && idIndex !== -1)
				userData?.ownList?.splice(idIndex, 1)

			userData?.imgMap?.delete(id)
		})
	}
</script>

<style lang="scss">
	:root {
		--swiper-scrollbar-bg-color: rgb(var(--v-theme-surface));
		--swiper-scrollbar-drag-bg-color: rgb(var(--v-theme-secondary));
		--swiper-scrollbar-size: 0.5rem;
		--swiper-scrollbar-border-radius: 5px;
	}
</style>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	.empty {
		height: 100%;
		text-align: center;

		&::after {
			content: '';
			display: inline-block;
			height: inherit;
			vertical-align: middle;
		}
	}

	$offset: 1.5rem;

	.link {
		position: absolute;
		right: $offset;
		bottom: $offset;
		margin-left: $offset;
	}

	.details {
		position: absolute;
		inset: 0;
		margin: auto;
		width: clamp(200px, 80%, 1000px);
		height: 90%;
	}

	.dialog {
		max-width: 100vw;
		max-height: 100vh;
	}

	.fix-outline {
		&::after {
			transform: translate(-2px, -2px);
		}
	}
</style>
