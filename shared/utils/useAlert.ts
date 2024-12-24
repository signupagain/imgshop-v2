export default () => {
	const alertList = useState<IAlert[]>('alertList')

	const msgList = computed(() => alertList.value.slice(0, 1))

	const spliceMsgList = async (onBeforeCallback?: () => Promise<unknown>) => {
		if (onBeforeCallback) await onBeforeCallback()

		alertList.value.splice(0, 1)
	}

	return { alertList, msgList, spliceMsgList }
}
