export default (localPage: number) => {
	const config = useRuntimeConfig()
	const perGroupSize = +config.public.imgGroupSize
	if (typeof perGroupSize !== 'number') throw new Error('Invalid imgGroupSize')

	return localPage * perGroupSize
}
