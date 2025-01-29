interface useAvgImgHeightListType {
	avgHeight: number
	prevDiff: number | null
	(data: imgDataType[][]): imgDataType[][]
}

const ACCURACY = 100

const useAvgImgHeightList: useAvgImgHeightListType = data => {
	const flatData = data.flat()

	if (flatData.length <= data.length) return data

	if (useAvgImgHeightList.avgHeight === 0)
		useAvgImgHeightList.avgHeight += Math.round(
			flatData.reduce((a, c) => a + (c.height / c.width) * ACCURACY, 0) /
				data.length
		)

	const { bigOneIndex, smallOneIndex, diff: curDiff } = diffData(data)

	if (bigOneIndex === smallOneIndex) return data

	const newData = data.map(arr => [...arr])

	const imgData = newData[bigOneIndex]!.pop()!
	newData[smallOneIndex]!.push(imgData)

	const { diff: newDiff } = diffData(newData)

	if (newDiff >= curDiff) {
		return data
	}

	useAvgImgHeightList.prevDiff = newDiff
	return useAvgImgHeightList(newData)
}

useAvgImgHeightList.avgHeight = 0
useAvgImgHeightList.prevDiff = null

function diffData(data: imgDataType[][]) {
	const diffList = data.map(arr => {
		return (
			Math.round(arr.reduce((a, c) => a + (c.height / c.width) * ACCURACY, 0)) -
			useAvgImgHeightList.avgHeight
		)
	})

	const bigOneIndex = diffList.findIndex(val => val === Math.max(...diffList))
	const smallOneIndex = diffList.findIndex(val => val === Math.min(...diffList))

	const diff = Math.abs(diffList[bigOneIndex]! - diffList[smallOneIndex]!)

	return { bigOneIndex, smallOneIndex, diff }
}

export default useAvgImgHeightList
