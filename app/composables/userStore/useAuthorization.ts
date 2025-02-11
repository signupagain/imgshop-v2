export default () => {
	const { accessJWT } = useUserStorage()

	return `Bearer ${accessJWT?.value}`
}
