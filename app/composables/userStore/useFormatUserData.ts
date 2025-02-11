export default ({
	username,
	name,
	ownList,
	imgMap,
}: SerializableUserData): ClientUserData => ({
	username,
	name,
	ownList,
	imgMap:
		imgMap ?
			(new Map(Object.entries(imgMap)) as ClientUserData['imgMap'])
		:	undefined,
})
