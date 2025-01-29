import { PexelsMode } from '~~/shared/constants/img'

export type singleLibType = {
	photos: Map<ImgIdType, ImgType>
	page: number
	localPage: number
	isFullyShown: boolean
}

export const useImageStore = defineStore('IMGSTORE', () => {
	const config = useRuntimeConfig()
	const perGroupSize = +config.public.imgGroupSize
	if (typeof perGroupSize !== 'number') throw new Error('Invalid imgGroupSize')

	const curatedLibrary = ref<singleLibType>({
		photos: new Map(),
		page: 1,
		localPage: 1,
		isFullyShown: false,
	})

	const appendCuratedLibrary = async () => {
		if (curatedLibrary.value.isFullyShown) return false

		const curDisplayAmount = perGroupSize * curatedLibrary.value.localPage
		const curLibSize = curatedLibrary.value.photos.size

		if (curLibSize !== 0) curatedLibrary.value.localPage++

		if (curLibSize > curDisplayAmount) return true

		const data = await useSearchRequest({
			mode: PexelsMode.Curated,
			page: curatedLibrary.value.page,
		}).catch((res: IFetchError) => res.status)

		if (typeof data === 'number' || !data) return false

		data.photos.forEach(img => {
			if (curatedLibrary.value.photos.has(`id${img.id}`)) return

			curatedLibrary.value.photos.set(`id${img.id}`, img)
		})

		if (!data.next_page) curatedLibrary.value.isFullyShown = true

		curatedLibrary.value.page++

		return true
	}

	const imgLibrary = ref<Map<string, singleLibType>>(new Map())

	watch(
		() => imgLibrary.value.size,
		size => {
			if (size > 10) {
				const firstOne = imgLibrary.value.keys().next().value!
				imgLibrary.value.delete(firstOne)
			}
		}
	)

	const curTheme = ref('')

	const getImages = async (query: string) => {
		if (imgLibrary.value.has(query)) return true

		const data = await useSearchRequest({
			mode: PexelsMode.Search,
			query,
		}).catch((res: IFetchError) => res.status)

		if (typeof data === 'number' || !data) return false

		const isFullyShown = !data.next_page

		imgLibrary.value.set(query, {
			photos: new Map(),
			page: 1,
			localPage: 1,
			isFullyShown,
		})

		data.photos.forEach(img => {
			if (imgLibrary.value.get(query)?.photos.has(`id${img.id}`)) return

			imgLibrary.value.get(query)?.photos.set(`id${img.id}`, img)
		})

		curTheme.value = query

		return true
	}

	const appendImages = async () => {
		const query = curTheme.value!
		const singleLib = imgLibrary.value.get(query)

		if (!singleLib || singleLib.isFullyShown) return false

		const curDisplayAmount = perGroupSize * singleLib.localPage

		if (singleLib.photos.size !== 0) singleLib.localPage++

		if (singleLib.photos.size > curDisplayAmount) return true

		const page = singleLib.page + 1

		const data = await useSearchRequest({
			mode: PexelsMode.Search,
			query,
			page,
		}).catch((res: IFetchError) => res.status)

		if (typeof data === 'number' || !data) return false

		data.photos.forEach(img => {
			if (singleLib.photos.has(`id${img.id}`)) return

			singleLib.photos.set(`id${img.id}`, img)
		})

		if (!data.next_page) singleLib.isFullyShown = true

		singleLib.page++

		return true
	}

	const curThemeList = ref(new Map<string, imgDataType>())

	watchEffect(() => {
		const userStore = useUserStore()
		let lib: singleLibType

		if (curTheme.value === '') {
			if (curatedLibrary.value.photos.size === 0) return

			lib = curatedLibrary.value
		} else lib = imgLibrary.value.get(curTheme.value)!

		const displayEntries = Array.from(lib.photos.entries()).slice(
			0,
			perGroupSize * lib.localPage
		)

		curThemeList.value = useImgDataMap(
			displayEntries,
			userStore.userData?.ownList
		)
	})

	const throttledUpdateImg = useThrottleFn(
		async (theme = '') =>
			theme === '' ? await appendCuratedLibrary() : await appendImages(),
		5000,
		true
	)

	return {
		curatedLibrary,
		appendCuratedLibrary,
		imgLibrary,
		curTheme,
		getImages,
		appendImages,
		curThemeList,
		throttledUpdateImg,
	}
})
