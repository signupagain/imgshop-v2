export default (
	imgData: [string, ImgType | imgDataType][],
	ownList: string[] = []
): Map<string, imgDataType> => {
	return new Map(
		imgData.map(([id, data]) => {
			return [id, { ...data, isOwn: ownList.includes(id) }]
		})
	)
}
