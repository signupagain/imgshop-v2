export default (
	data: Map<string, imgDataType>,
	curDisplayWidth: number,
	displayWidthList: [number, number]
): globalThis.imgDataType[][] => {
	if (curDisplayWidth < Math.min(...displayWidthList) || data.size === 0) {
		return [Array.from(data.values())]
	}

	const imgSourceArr = [...data.values()]
	const colsCount = curDisplayWidth > Math.max(...displayWidthList) ? 3 : 2
	const layoutArr: Array<imgDataType[]> = Array.from(
		{ length: colsCount },
		() => []
	)

	for (
		let index = 0, pos = 0, goRight = true;
		index < imgSourceArr.length;
		index++
	) {
		layoutArr[pos]?.push(imgSourceArr[index]!)

		if (goRight) pos++
		else pos--

		if (pos >= colsCount || pos < 0) goRight = !goRight

		if (pos >= colsCount) pos = colsCount - 1

		if (pos < 0) pos = 0
	}

	return layoutArr
}
