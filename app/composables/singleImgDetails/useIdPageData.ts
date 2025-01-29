import type { item } from '~/components/Img/Details.vue'

export default async (id: ImgIdType) => {
	let curImgData: ImgType | undefined

	const imgStore = useImageStore()

	curImgData = imgStore.curThemeList.get(id)

	if (!curImgData) {
		const result = await useSearchId(parseInt(id.substring(2)))

		if (typeof result === 'number') await navigateTo('/')
		else curImgData = result
	}

	assertIsDefined('curImgData', curImgData)

	const alt =
		!curImgData.alt || curImgData.alt === '' ? '未命名' : curImgData.alt

	const items: item[] = [
		{
			title: '作品名',
			value: alt,
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
	]

	return { curImgData, items, alt }
}
