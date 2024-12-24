export default async (e: MouseEvent) => {
	const { $useAlert } = useNuxtApp()
	const { spliceMsgList } = $useAlert()

	const promiseFn = () =>
		new Promise<void>(res => {
			let el = e.target

			while (!(el instanceof HTMLParagraphElement)) {
				assertIsNode(el)

				el = el.parentElement
			}

			el.classList.add('right')
			el.classList.add('active')

			setTimeout(() => res(), 2100)
		})

	await spliceMsgList(promiseFn)
}
