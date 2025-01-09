<template>
	<v-card ref="card" class="elevation-3" @keyup.tab="state = Trigger.other">
		<v-text-field
			v-model="keyword"
			:loading="isLoading"
			append-inner-icon="$search"
			variant="solo"
			density="compact"
			hide-details="auto"
			:class="$style.input"
			@keyup.stop.up="move(Direction.goUp)"
			@keyup.stop.down="move(Direction.goDown)"
			@click:append-inner="search(keyword)"
			@keyup.enter="search(keyword)"
			@mousedown:control="isDropdownOpen = true"
			@update:model-value="state = Trigger.inputEvent"
			@keyup.esc="isDropdownOpen = false"
			@input="isDropdownOpen = true"
		></v-text-field>
		<div
			:class="[$style.dropdown, { active: isDropdownOpen }]"
			:style="{ overflow: isScroll ? 'auto' : 'hidden' }"
		>
			<v-card-text v-element-size="onResize" class="pb-1">
				<v-divider v-show="isDropdownOpen" thickness="3"></v-divider>
				<v-list ref="list" tag="ul" class="pa-0">
					<v-list-item v-if="items.length === 0" class="text-center">
						尚無紀錄
					</v-list-item>
					<template v-else>
						<v-list-item
							v-for="item of items"
							:key="item"
							tag="li"
							:value="item"
							:title="item"
							variant="plain"
							:ripple="false"
							tabindex="0"
							@click="search(item)"
							@focus="keyword = item"
							@keyup.enter="search(item)"
						>
							<template #append>
								<v-btn
									icon="$close"
									variant="text"
									size="small"
									@click.stop="historySetData.delete(item)"
									@keyup.enter.stop="historySetData.delete(item)"
								></v-btn>
							</template>
						</v-list-item>
					</template>
				</v-list>
			</v-card-text>
		</div>
	</v-card>
</template>

<script setup lang="ts">
	import { vElementSize } from '@vueuse/components'

	const keyword = ref('')
	const historySetData = useLocalSearchHistory()

	enum Trigger {
		inputEvent,
		other,
	}
	const state = ref<Trigger>(Trigger.inputEvent)

	const activeEl = useActiveElement()
	const cardEl = useTemplateRef('card')

	const isDropdownOpen = defineModel('isOpen', {
		type: Boolean,
		default: false,
	})

	onClickOutside(cardEl, () => (isDropdownOpen.value = false))

	onMounted(() => {
		watch(activeEl, el => {
			assertIsDefined('cardEl', cardEl.value)
			assertIsDefined('activeEl', el)

			if (cardEl.value.$el.contains(el)) {
				isDropdownOpen.value = true
				state.value = Trigger.other
				return
			}
		})
	})

	const listEl = useTemplateRef('list')

	enum Direction {
		goUp,
		goDown,
	}

	const move = (key: Direction) => {
		assertIsHTMLElement(listEl.value?.$el)
		assertIsHTMLElement(listEl.value.$el.firstElementChild)
		assertIsHTMLElement(listEl.value.$el.lastElementChild)

		if (key === Direction.goDown) {
			listEl.value.$el.firstElementChild.focus()
			return
		}

		listEl.value.$el.lastElementChild.focus()
	}

	const items = computed(() => {
		if (state.value === Trigger.other)
			return Array.from(historySetData.value).reverse()

		return Array.from(historySetData.value)
			.filter(val => keyword.value === '' || val.includes(keyword.value))
			.reverse()
	})

	const isScroll = ref(false)
	const MAX_HEIGHT = '180px'

	const onResize = ({ height }: { height: number }) => {
		if (height >= parseInt(MAX_HEIGHT) && historySetData.value.size > 3) {
			isScroll.value = true
			return
		}

		isScroll.value = false
	}

	const isLoading = defineModel('isLoading', { type: Boolean, default: false })

	const search = async (theme: string) => {
		theme = theme.trim()

		if (theme === '') {
			keyword.value = ''

			return
		}

		isDropdownOpen.value = false
		isLoading.value = true

		if (historySetData.value.has(theme)) {
			historySetData.value.delete(theme)
			historySetData.value.add(theme)
		} else historySetData.value.add(theme)

		const isSuccess = await useDebouncedLoadingImg(theme)

		if (typeof isSuccess !== 'boolean') return

		isLoading.value = false

		if (!isSuccess) {
			const list = useState<IAlert[]>('alertList')

			if (list.value.some(msg => msg.title === '搜尋失敗，請更換關鍵字')) return

			list.value.push({
				type: 'warning',
				title: '搜尋失敗，請更換關鍵字',
				id: nanoid(5),
			})

			return
		}

		await navigateTo({ name: 'search', query: { theme } })
	}
</script>

<style lang="scss" module>
	.input {
		position: relative;
		z-index: 1;
	}

	.dropdown {
		max-height: 0;
		overscroll-behavior: contain;

		transition: max-height 0.2s;

		&:global(.active) {
			max-height: v-bind(MAX_HEIGHT);
		}
	}

	.hidden {
		position: absolute;
		clip-path: inset(100%);
	}
</style>
