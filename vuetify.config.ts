import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
	// your Vuetify options here
	theme: {
		defaultTheme: 'dark',
	},
	icons: {
		defaultSet: 'mdi-svg',
		svg: {
			mdi: {
				aliases: {
					theme: 'mdiThemeLightDark',
					shopping: 'mdiCart',
					account: 'mdiAccount',
					search: 'mdiMagnify',
					add: 'mdiPlus',
					menu: 'mdiMenu',
					close: 'mdiClose',
					link: 'mdiOpenInNew',
				},
			},
		},
	},
})
