import { debounceFilter, useStorage } from '@vueuse/core'

export default () => {
	const MAX_VALUE = 15
	const SEARCH_HISTORY = 'search_history'

	const result = ref(new Set<string>())

	if (import.meta.client) {
		const state = useStorage<string[]>(SEARCH_HISTORY, [], localStorage, {
			mergeDefaults(storageValue, defaults) {
				if (storageValue.length > 0) {
					const arr = storageValue.slice(-MAX_VALUE)

					if (arr.some(v => typeof v !== 'string')) return defaults

					return arr
				}

				return defaults
			},
			eventFilter: debounceFilter(500),
		})

		onMounted(() => {
			state.value.forEach(val => result.value.add(val))

			watch(
				result,
				val => {
					const arr = Array.from(val)

					if (arr.length > MAX_VALUE) {
						result.value = new Set(arr.slice(-MAX_VALUE))
						return
					}

					state.value = arr
				},
				{ deep: 1 }
			)
		})
	}

	return result
}
