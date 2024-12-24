// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	debug: import.meta.dev,

	future: {
		compatibilityVersion: 4,
	},

	ssr: true,

	// when enabling ssr option you need to disable inlineStyles and maybe devLogs
	features: {
		inlineStyles: false,
		devLogs: false,
	},

	runtimeConfig: {
		public: {
			appName: process.env.NUXT_PUBLIC_APP_NAME,
		},
	},

	experimental: {
		typedPages: true,
	},

	build: {
		transpile: ['vuetify'],
	},

	vite: {
		ssr: {
			noExternal: ['vuetify'],
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "assets/scss/variables" as var;',
				},
			},
			modules: {
				localsConvention: 'camelCase',
				generateScopedName: '[hash:base64:5]',
			},
		},
	},

	css: ['assets/scss/main.scss'],
	modules: [
		'@nuxt/fonts',
		'vuetify-nuxt-module',
		'@nuxt/eslint',
		'@vueuse/nuxt',
		[
			'@pinia/nuxt',
			{
				autoImports: [
					// 自动引入 `defineStore()`
					'defineStore',
					// 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
					['defineStore', 'definePiniaStore'],
				],
			},
		],
	],

	imports: {
		presets: [
			{
				from: 'nanoid',
				imports: ['nanoid'],
			},
		],
	},

	nitro: {
		imports: {
			presets: [
				{
					from: 'nanoid',
					imports: ['nanoid'],
				},
			],
		},
	},

	plugins: ['~~/plugins/api', '~~/plugins/swiper.client'],

	vuetify: {
		moduleOptions: {
			// check https://nuxt.vuetifyjs.com/guide/server-side-rendering.html
			ssrClientHints: {
				reloadOnFirstRequest: false,
				viewportSize: true,
				prefersColorScheme: false,

				prefersColorSchemeOptions: {
					useBrowserThemeOnly: false,
				},
			},

			// /* If customizing sass global variables ($utilities, $reset, $color-pack, $body-font-family, etc) */
			// disableVuetifyStyles: true,
			styles: {
				configFile: 'assets/scss/settings.scss',
			},
		},
	},
})
