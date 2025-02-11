<template>
	<v-card
		tag="article"
		class="px-3 h-100"
		:class="$style['select-none']"
		@scroll.passive.stop="scrollPrevent"
	>
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
	import { DETAILS_PATH } from '~~/shared/params/route'

	const { tag = 'h1' } = defineProps<{
		tag?: keyof IntrinsicElementAttributes
	}>()

	const isScrolling = ref(false)

	const scrollPrevent = () => {
		isScrolling.value = true
		let token: NodeJS.Timeout | null = null

		if (token) return

		token = setTimeout(() => {
			isScrolling.value = false
			token = null
		}, 200)
	}

	const imgStore = useImageStore()
	const userStore = useUserStore()

	const { curThemeList, curTheme, curatedLibrary, imgLibrary } =
		storeToRefs(imgStore)
	const { userData } = storeToRefs(userStore)

	const route = useRoute()
	const { width: windowWidth } = useWindowSize()

	const title = computed(() => {
		return route.name.startsWith('index') ? '精選圖庫' : curTheme.value
	})

	const dynamicLayoutList = computed(() =>
		useImgLayoutList(curThemeList.value, windowWidth, [660, 1000])
	)

	const hasMoreData = ref(true)

	const fixedLayoutList = computed(() =>
		hasMoreData.value ? null : useAvgImgHeightList(dynamicLayoutList.value)
	)

	const layoutList = computed(() =>
		hasMoreData.value ? dynamicLayoutList.value : fixedLayoutList.value
	)

	const spacer = ref(null)

	const { stop } = useIntersectionObserver(spacer, async ([entries]) => {
		if (!entries?.isIntersecting) return

		const isSuccess = await imgStore.debouncedUpdateImg(curTheme.value)

		if (typeof isSuccess !== 'boolean') return

		hasMoreData.value = isSuccess

		if (!isSuccess) stop()
	})

	const event = async (e: MouseEvent) => {
		if (isScrolling.value) return

		let target = e.target

		if (target instanceof HTMLImageElement) {
			const reg = /\/(\d+)\//
			const id = target.src.match(reg)![1]

			assertIsDefined('id', id)

			navigateTo({ path: `${DETAILS_PATH}/${id}` })
		}

		if (
			target instanceof SVGPathElement ||
			target instanceof SVGElement ||
			target instanceof HTMLButtonElement
		) {
			while (!(target instanceof HTMLAnchorElement)) {
				assertIsNode(target)
				assertIsDefined('parentElement', target.parentElement)

				target = target.parentElement
			}
		}

		if (target instanceof HTMLAnchorElement) {
			const id = `id${target.href.split('/').pop()}` as const

			const photos =
				curTheme.value === '' ?
					curatedLibrary.value.photos
				:	imgLibrary.value.get(curTheme.value)?.photos

			if (!userData.value?.ownList) userData.value!.ownList = [id]
			else userData.value.ownList.push(id)

			if (!userData.value?.imgMap)
				userData.value!.imgMap = new Map([[id, photos!.get(id)!]])
			else userData.value.imgMap.set(id, photos!.get(id)!)

			const isSuccess = await userStore.updateUserData({
				ownList: [id],
				patchImgList: [photos!.get(id)!],
			})

			if (!isSuccess) userStore.isSignin = false

			const list = useState<IAlert[]>('alertList')

			if (list.value.some(msg => msg.title === '收藏成功')) return

			list.value.push({
				type: 'success',
				title: '收藏成功',
				id: nanoid(5),
			})
		}
	}
</script>

<style lang="scss" module>
	@use 'assets/scss/utils.module';

	$imgGap: 0.3rem;

	.row,
	.col {
		display: flex;
		gap: $imgGap;
	}

	.row {
		justify-content: center;
	}

	.col {
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
		margin-top: calc(12px - $imgGap);
	}
</style>
