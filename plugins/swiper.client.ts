import { register } from 'swiper/element/bundle'

export default defineNuxtPlugin({
	name: 'swiper',
	setup() {
		register()
	},
})
