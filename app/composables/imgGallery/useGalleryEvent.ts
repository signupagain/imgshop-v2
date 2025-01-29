import { DETAILS_PATH } from '~~/shared/constants/route'

export default function () {
	const { curTheme, curatedLibrary, imgLibrary } = storeToRefs(useImageStore())
	const userStore = useUserStore()
	const { userData } = storeToRefs(userStore)

	return async function (e: MouseEvent) {
		let target = e.target

		if (target instanceof HTMLImageElement) {
			const reg = /\/(\d+)\//
			const id = target.src.match(reg)![1]

			assertIsDefined('id', id)

			await navigateTo({ path: `${DETAILS_PATH}/${id}` })
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
}
