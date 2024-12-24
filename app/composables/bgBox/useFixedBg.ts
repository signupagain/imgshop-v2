import DarkBg from '~/assets/imgs/DarkBg.jpg'
import LightBg from '~/assets/imgs/LightBg.jpg'

export interface IBgBoxSrc {
	src: string
	by: string
	from: string
}

type themes = 'dark' | 'light'

const fixedBg: Record<themes, IBgBoxSrc> = {
	dark: {
		src: DarkBg,
		by: 'Photo by Alex Sever',
		from: 'https://www.pexels.com/photo/stunning-northern-lights-over-belarus-stream-28994499/',
	},
	light: {
		src: LightBg,
		by: 'Photo by Mark Chen',
		from: 'https://www.pexels.com/photo/27544946/',
	},
}

export default fixedBg
