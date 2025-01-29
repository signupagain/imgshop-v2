import { PexelsMode } from '~~/shared/params/img'

export type singleLibType = {
	photos: Map<ImgIdType, ImgType>
	page: number
	localPage: number
	isFullyShown: boolean
}

export const useImageStore = defineStore('IMGSTORE', () => {
	const curatedLibrary = ref<singleLibType>({
		photos: new Map(),
		page: 1,
		localPage: 1,
		isFullyShown: false,
	})

	const appendCuratedLibrary = async () => {
		if (curatedLibrary.value.isFullyShown) {
			useState<IAlert[]>('alertList').value.push({
				type: 'info',
				title: '已完全加載。',
				id: nanoid(5),
			})

			return false
		}

		const curDisplayAmount = useCurDisplayAmount(curatedLibrary.value.localPage)

		if (curatedLibrary.value.photos.size >= curDisplayAmount) {
			curatedLibrary.value.localPage++
			return true
		}

		const data = await useSearchRequest({
			mode: PexelsMode.Curated,
			page: curatedLibrary.value.page,
		}).catch((res: IFetchError) => res.status)

		if (typeof data === 'number') throwServerError()

		if (!data) return false

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

		if (typeof data === 'number') return false

		if (!data) return false

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

		if (imgLibrary.value.get(query)!.isFullyShown) {
			useState<IAlert[]>('alertList').value.push({
				type: 'info',
				title: '已完全加載。',
				id: nanoid(5),
			})

			return false
		}

		const curDisplayAmount = useCurDisplayAmount(
			imgLibrary.value.get(query)!.localPage
		)

		if (imgLibrary.value.get(query)!.photos.size >= curDisplayAmount) {
			imgLibrary.value.get(query)!.localPage++
			return true
		}

		const page = imgLibrary.value.get(query)!.page + 1

		const data = await useSearchRequest({
			mode: PexelsMode.Search,
			query,
			page,
		}).catch((res: IFetchError) => res.status)

		if (typeof data === 'number' || !data) return false

		data.photos.forEach(img => {
			if (imgLibrary.value.get(query)!.photos.has(`id${img.id}`)) return

			imgLibrary.value.get(query)!.photos.set(`id${img.id}`, img)
		})

		if (!data.next_page) imgLibrary.value.get(query)!.isFullyShown = true

		imgLibrary.value.get(query)!.page++

		return true
	}

	const curThemeList = computed(() => {
		const { userData } = storeToRefs(useUserStore())

		const data =
			curTheme.value === '' ?
				curatedLibrary.value
			:	imgLibrary.value.get(curTheme.value)

		const curImgAmount = useCurDisplayAmount(toValue(data)!.localPage)

		const displayEntries = Array.from(toValue(data)!.photos.entries()).slice(
			0,
			curImgAmount
		)

		return useImgDataMap(displayEntries, curThemeOwnList.value)
	})

	const debouncedUpdateImg = useDebounceFn(
		async (theme = ''): Promise<boolean> =>
			theme === '' ? await appendCuratedLibrary() : await appendImages(),
		500
	)

	return {
		curatedLibrary,
		appendCuratedLibrary,
		imgLibrary,
		curTheme,
		getImages,
		appendImages,
		curThemeList,
		debouncedUpdateImg,
	}
})
