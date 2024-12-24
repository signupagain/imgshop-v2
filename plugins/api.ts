export default defineNuxtPlugin({
	name: 'baseAPI',
	setup() {
		const api = $fetch.create({
			timeout: 5000,
			retry: 0,
			onRequestError: () => {
				const list = useState<IAlert[]>('alertList')

				if (!navigator.onLine) {
					if (list.value.some(msg => msg.title === '網絡問題，請檢查網絡。'))
						return

					list.value.push({
						type: 'error',
						title: '網絡問題，請檢查網絡。',
						id: nanoid(5),
					})

					return
				}

				list.value.push({
					type: 'warning',
					title: '服務器繁忙，稍後再試。',
					id: nanoid(5),
				})
			},
		})

		useState<IAlert[]>('alertList', () => [])

		return {
			provide: {
				api,
				useAlert,
			},
		}
	},
	hooks: {
		'app:mounted': () => {
			addEventListener('offline', () => {
				useState<IAlert[]>('alertList').value.push({
					type: 'error',
					title: '網絡問題，請檢查網絡。',
					id: nanoid(5),
				})
			})

			setTimeout(() => {
				const { userData } = storeToRefs(useUserStore())

				if (userData.value) {
					const name = userData.value.name ?? userData.value.username

					useState<IAlert[]>('alertList').value.push({
						type: 'success',
						title: name,
						text: '歡迎回到ImgShop!',
						id: nanoid(5),
					})

					return
				}

				useState<IAlert[]>('alertList').value.push({
					type: 'info',
					title: '歡迎來到ImgShop!',
					id: nanoid(5),
				})
			}, 500)
		},
	},
})
