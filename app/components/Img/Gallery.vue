<template>
	<v-card tag="article" class="px-3 h-100" :class="$style['select-none']">
		<v-card-item>
			<v-card-title :tag class="text-h4 my-3 text-center">
				{{ title }}
			</v-card-title>
		</v-card-item>
		<v-card-text :class="$style.row" @click="event">
			<v-list
				v-for="(imgList, index) of layoutList"
				:key="index"
				:class="$style.col"
			>
				<v-list-item
					v-for="{
						id,
						src,
						photographer,
						url,
						width,
						alt,
						isOwn,
						height,
					} of imgList"
					:key="id"
					tag="a"
					:class="$style.box"
					class="ma-3 pa-0 elevation-5"
					:href="`/details/${id}`"
					:ripple="false"
					@click.prevent
				>
					<v-img
						crossorigin="anonymous"
						:style="{ aspectRatio: (width / height).toFixed(2) }"
						:alt="alt ?? '未命名'"
						:src="src.large2x"
						:lazy-src="src.small"
						transition="vimg"
					>
						<template #placeholder>
							<div :class="$style.placeholder">
								<v-progress-circular
									color="primary"
									indeterminate
									size="50"
									width="10"
								></v-progress-circular>
							</div>
						</template>
					</v-img>
					<bg-box-link
						:class="$style.link"
						:by="photographer"
						:href="url"
						@click.stop
					/>
					<v-btn
						v-if="userData && !isOwn"
						:rounded="false"
						:class="$style.add"
						icon="$add"
						size="small"
					></v-btn>
				</v-list-item>
				<div ref="spacer" :class="$style.spacer"></div>
			</v-list>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
	import type { IntrinsicElementAttributes } from 'vue'

	const { tag = 'h1' } = defineProps<{
		tag?: keyof IntrinsicElementAttributes
	}>()

	const imgStore = useImageStore()
	const { curThemeList, curTheme } = storeToRefs(imgStore)

	const userStore = useUserStore()
	const { userData } = storeToRefs(userStore)

	const { currentRoute } = useRouter()

	const title = ref<string>()
	const layoutList = ref<imgDataType[][]>()

	const layoutDisplay: [number, number] = [660, 1000]
	const { width: windowWidth } = useWindowSize()

	watch(
		[currentRoute, curThemeList, windowWidth],
		useDebounceFn(async ([route, curList, width]) => {
			if (route.name.endsWith('-id')) {
				if (route.name === 'index-id') title.value = '精選圖庫'
				else title.value = curTheme.value

				layoutList.value = useImgLayoutList(curList, width, layoutDisplay)

				return
			}

			await nextTick()

			setTimeout(() => {
				if (route.name === 'index') {
					curTheme.value = ''
					title.value = '精選圖庫'
				}

				const theme = route.query.theme as string
				if (theme) curTheme.value = title.value = theme

				layoutList.value = useImgLayoutList(curList, width, layoutDisplay)
			}, 150)
		}),
		{ immediate: true }
	)

	const spacer = ref(null)
	const hasMoreData = ref(true)

	const { stop } = useIntersectionObserver(spacer, async ([entries]) => {
		if (!entries?.isIntersecting) return

		const isSuccess = await imgStore.throttledUpdateImg(curTheme.value)

		if (typeof isSuccess !== 'boolean') return

		hasMoreData.value = isSuccess

		if (!isSuccess) {
			stop()

			const list = useState<IAlert[]>('alertList')

			if (list.value.some(msg => msg.title === '已完全加載。')) return

			list.value.push({
				type: 'info',
				title: '已完全加載。',
				id: nanoid(5),
			})
		}
	})

	watch(hasMoreData, hasMore => {
		if (hasMore) return

		layoutList.value = useAvgImgHeightList(layoutList.value!)
	})

	const event = useGalleryEvent()

	const hooks = [onMounted, onActivated]

	hooks.forEach(hook => {
		hook(async () => await debouncedScroll())
	})

	const debouncedScroll = useDebounceFn(scroll, 100)

	async function scroll() {
		await nextTick()

		const savedPosition = history.state?.scroll

		if (savedPosition) scrollTo({ ...savedPosition, behavior: 'auto' })
	}
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	$imgGap: 0.3rem;

	%df {
		display: flex;
		gap: $imgGap;
	}

	.row {
		@extend %df;
		justify-content: center;
	}

	.col {
		@extend %df;

		flex: 1;
		flex-flow: column;
	}

	.box {
		display: block;
		position: relative;
		border-radius: var.$radius;
		overflow: hidden;
		cursor: pointer;
	}

	.link {
		$offset: 0.5rem;

		position: absolute;
		left: $offset;
		bottom: $offset;
		margin-right: $offset;
	}

	.add {
		$offset: 1rem;

		position: absolute !important;
		top: $offset;
		right: $offset;
		border-radius: var.$radius !important;
	}

	.spacer {
		flex: 1;
		min-height: 0.5rem;
		margin-top: calc(12px - $imgGap);
	}
</style>
